import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../../config/nodemailer.js";
import PropertyOwners from "../../models/propertyOwnerModels/propertyOwners.js";
import Tokens from "../../models/propertyOwnerModels/tokens.js";
import Blacklist from "../../models/propertyOwnerModels/blacklists.js";
import sendEmail from "../../middlewares/propertyOwnerMiddleware/sendMail.js";
import { generateAccessToken, generateRefreshToken, generateOTP } from "../../middlewares/propertyOwnerMiddleware/helper.js";
import mongoose from "mongoose";

const createPropertyOwners = async (req, res) => {
  let file;
  let path;
  const { username, first_name, last_name, email, phone } = req.body;
  const password = req.header("password");
  if (req.profileExists) {
    console.log(req.file);
    const { filename, path: filepath } = req.file;  
    file = filename;
    path = filepath;
  }
  const data = { ...req.body };
  data.propertyOwner_id = req.propertyOwner_id;
  if (!data.propertyOwner_id) {
    return res.status(400).json({ error: "Property Owner ID is undefined!!!" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const owner = new PropertyOwners({
      propertyOwner_id: req.propertyOwner_id,
      username,
      password: hashedPassword,
      first_name,
      last_name, 
      email,
      phone,
      profile: req.profileExists ? file : "",
      profile_path: req.profileExists ? path : "",
    });
    owner.emailVerification = "not verified";
    owner.emailVerificationToken = crypto.randomBytes(32).toString("hex");
    await owner.save();
    // console.log(owner);
    const url = `http://localhost:5173/owners/${owner.id}/verify/${owner.emailVerificationToken}`;
    console.log(`url: ${url}`);
    sendEmail(email, url);
    res.status(200).json({
      success: true,
      message: "Registration success. Verification  mail sent successfully",
      url: url,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Error" });
  }
};

const ownerLogin = async (req, res) => {
  // console.log(req.body);
  const { username } = req.body;
  const password = req.header("password");
  // console.log(password);
  try {  
    const owner = await PropertyOwners.findOne({ username }); 
    if (owner.emailVerification === "not verified") {
      console.log("Your email is not verified yet");
      return res
        .status(400)
        .json({ error: "Verification Email sent to your mail" });
    } else {
      if (!bcrypt.compareSync(password, owner.password)) {
        return res.status(400).json({ error: "Invalid password." });
      }
      const payload = {
        owner: {
          id: owner._id,
          owner_id: owner.propertyOwner_id,
        },
        /* To find owner */
        // id: owner.propertyOwner_id,
      };
      const tokens = await Tokens.find({}, "propertyOwner_id").exec(); 
      /* It is true, even tokens is "empty" i.e [] */
      if (tokens) {
        let arrOwnerID = tokens.map((owner) => owner.propertyOwner_id);  
        const ownerIDExists = arrOwnerID.includes(owner.propertyOwner_id);
        let accessToken;
        let refreshToken;
        /* Checks whether the ownerID exists in Tokens collection or not */
        if (!ownerIDExists) {
          accessToken = generateAccessToken(payload);
          refreshToken = await generateRefreshToken(
            payload,
            owner.propertyOwner_id
          );
        } else {
          /* To find refreshToken based on ownerID */
          const token = await Tokens.findOne({
            propertyOwner_id: owner.propertyOwner_id,
          }).exec();
          jwt.verify(
            token.token,
            process.env.REFRESH_SECRET_KEY,
            async (err, user) => {
              if (err)
                return res
                  .sendStatus(403)
                  .json({ error: "Invalid refresh token!" });
              accessToken = generateAccessToken(payload);
              refreshToken = token.token;
            }
          );
        }
        const now = new Date();
        owner.last_login = now.toISOString();
        await owner.save();
        return res.status(200).json({
          success: true,
          message: "Login success",
          accessToken,
          refreshToken,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Error" });
  }
};

const ownerLogout = async (req, res) => {
  /* The "x-auth-token" header contains accessToken of owner */
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }
  try {
    console.log(`Date.now(): ${Date.now()}`);
    console.log(`Date.now(): ${Date.now() + 3600 * 1}`);
    const blacklistedToken = new Blacklist({
      token,
      expiresAt: new Date(Date.now() + 3600 * 1),
    });
    await blacklistedToken.save();
    return res
      .status(200)
      .json({ success: true, message: "Owner logged out successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ error: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const owner = await PropertyOwners.findOne({ email: email });
    const otp = generateOTP();
    console.log(otp);
    owner.resetPasswordOTP = otp;
    // owner.resetPasswordOTPExpiry = Date.now() + 3600000; // 1 hour from now
    await owner.save();
    console.log(owner);
    res.cookie("email", email); 
    /* To send reset mail with OTP to owner's mail */
    const mailOptions = {
      from: process.env.EMAIL,
      to: owner.email,
      subject: "Password Reset",
      text: `We have received a request to reset your password. Please reset your password using the OTP below.\nOTP : ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error: ${error}`);
        return res.status(401).send("Error while sending reset mail to owner");
      } else {
        console.log(`Email sent: ${info.response}`);
        return res.status(200).json({
          success: true,
          message: "Password reset otp sent to your email successfully",
          otp: otp,
        });
      }
    });
  } catch (error) {
    //   console.log(error);
    res.status(500).send({ error: "Internal server error!!!" });
  }
};

const resetPassword = async (req, res) => {
  console.log("Called from resetPassword() controller");
  /* We don't need validate OTP here */
  const email = req.cookies.email;
  console.log(email);
  const new_password = req.header("new-password");
  console.log(`new_password: ${new_password}`);
  const confirm_password = req.header("confirm-password");
  console.log(`confirm_password: ${confirm_password}`);
  try {
    const owner = await PropertyOwners.findOne({ email });
    console.log(owner);
    const salt = await bcrypt.genSalt(10);
    console.log(`Old password HASH: ${owner.password}`);
    owner.password = await bcrypt.hash(new_password, salt);
    console.log(`New password HASH: ${owner.password}`);
    owner.resetPasswordOTP = "";
    await owner.save();
    res.clearCookie("email");
    /* To send success message once password is changed */
    const mailOptions = {
      from: process.env.EMAIL,
      to: owner.email,
      subject: "Password Reset Successfully",
      text: `Your request processed successfully. You can login with your new password.`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error: ${error}`);
        return res.status(401).send("Error while sending reset success mail");
      } else {
        console.log(`Email sent: ${info.response}`);
        return res.status(200).json({
          success: true,
          message: "Password reset successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).send({ error: "Internal server error!!!" });
  }
};

const verifyEmail = async (req, res) => {
  // console.log(req.params);
  const id = req.params.id; 
  const token = req.params.token;
  try {
    const owner = await PropertyOwners.findOne({ _id: id });
    if (!owner) {
      return res.send({ error: "Invalid link" });
    } 
    const verifyLink = await PropertyOwners.findOne({
      _id: id,
      emailVerificationToken: token,
    });
    if (!verifyLink) {
      return res.send({ error: "Invalid link" });
    }
    owner.emailVerification = "verified";
    owner.emailVerificationToken = "";
    await owner.save();
    // console.log(owner);
    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const ownerDetails = async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }
  let decoded = jwt.verify(token, process.env.SECRET_KEY); 
  // console.log(decoded);
  if (!decoded) {
    return res.status(400).json({ error: "Invalid token" });
  }
  try {
    const owner = await PropertyOwners.findOne({
      _id: decoded.owner.id,
    });
    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }
    return res.status(200).json({ owner });
  } catch (error) {
    console.error("Error in ownerDetails:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const ownerDetailsEdit = async (req, res) => {
  const updates = { ...req.body };
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }
  let decoded = jwt.verify(token, process.env.SECRET_KEY);
  if (!decoded) {
    return res.status(400).json({ error: "Invalid token" });
  }
  try {
    let file;
    let path;
    const owner = await PropertyOwners.findOne({
      _id: decoded.owner.id,
    });
    if (!owner) {
      return res.status(404).json({ error: "owner not found" }); 
    }
    if (req.profileExists) {
      console.log(req.file);
      const { filename, path: filepath } = req.file;
      file = filename;
      path = filepath;
    }
    const updateFields = {};
    for (let key in updates) {
      if (updates.hasOwnProperty(key)) {
        updateFields[key] = updates[key];
      }
    }
    updateFields.profile = file;
    updateFields.profile_path = path;
    // console.log(updateFields);
    await PropertyOwners.updateOne({ _id: owner.id }, { $set: updateFields });
    const updatedOwner = await PropertyOwners.findOne({
      _id: decoded.owner.id,
    });
    return res.status(200).json({ message: "Updated successfully",updatedOwner});
  } catch (error) {
    console.error("Error in ownerDetails:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ error: "Owner not exists" });
    }
    const id = new mongoose.Types.ObjectId(decoded.owner.id);
    const data = await PropertyOwners.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "ownerswithproperties",
          localField: "_id",
          foreignField: "ownerId",
          as: "ownerswithproperties",
        },
      },
      {
        $lookup: {
          from: "propertybasicinfos",
          localField: "ownerswithproperties.propertyId",
          foreignField: "_id",
          as: "properties",
        },
      },
      {
        $lookup: {
          from: "propertyfacilities",
          localField: "ownerswithproperties.propertyId",
          foreignField: "property_id",
          as: "facilities",
        },
      },
      {
        $unwind: "$properties",
      },
      {
        $lookup: {
          from: "propertyfacilities",
          localField: "properties._id",
          foreignField: "property_id",
          as: "properties.facilities",
        },
      },
      {
        $group: {
          _id: "$_id",
          propertyOwner_id: { $first: "$propertyOwner_id" },
          first_name: { $first: "$first_name" },
          last_name: { $first: "$last_name" },
          properties: { $push: "$properties" }, 
        }, 
      },
      {
        $project: {
          _id: 1,
          propertyOwner_id: 1,
          first_name: 1,
          last_name: 1,
          properties: {
            $map: {
              input: "$properties",
              as: "property",
              in: {
                _id: "$$property._id",
                property_id: "$$property.property_id",
                property_type: "$$property.property_type",
                location: "$$property.location",
                bedroom: "$$property.bedroom", 
                bathroom: "$$property.bathroom",
                square_feet: "$$property.square_feet",
                title: "$$property.title",
                description: "$$property.description",
                price: "$$property.price",
                service_type: "$$property.service_type",
                permit_type: "$$property.permit_type",
                property_img_name: "$$property.property_img_name",
                property_img_path: "$$property.property_img_path",
                property_doc_name: "$$property.property_doc_name",
                property_doc_path: "$$property.property_doc_path",
                property_vdo_name: "$$property.property_vdo_name",
                property_vdo_path: "$$property.property_vdo_path",
                facilities: {
                  $arrayElemAt: ["$$property.facilities", 0],
                },
              },
            },
          },
        },
      },
    ]);
    return res.status(200).json({ data, success: true, message: "Property details fetched successfully"});
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error: "Internal server error" });
  }
}; 

export {
  createPropertyOwners,
  ownerLogin,
  ownerLogout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  ownerDetails,
  ownerDetailsEdit,
  getAllProperties,
};
