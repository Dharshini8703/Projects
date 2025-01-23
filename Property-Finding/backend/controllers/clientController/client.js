import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Clients from "../../models/clientModel/clients.js";
import Tokens from "../../models/clientModel/tokens.js";
import Blacklist from "../../models/clientModel/blacklist.js";
import transporter from "../../config/nodemailer.js";
import {
  generateAccessToken,
  generateOTP,
  generateRefreshToken,
} from "../../middlewares/clientMiddleware/helper.js";

/* To create a account for client */
const createClientController = async (req, res) => {
  console.log(req.body);
  try {
    const { username, name, email, phone, address } = req.body;
    const password = req.header("password");
    console.log(password);
    const { filename, path: filepath } = req.file;
    const data = { ...req.body };
    data.client_id = req.client_id;
    if (!data.client_id) {
      return res.status(400).json({errors:"Client ID is undefined!!!"});
    }
    // console.log(data);
    // console.log(req.file);
    const client = new Clients({
      client_id: req.client_id,
      username,
      password,
      name,
      email,
      phone,
      address,
      profile_name: filename,
      profile_path: filepath,
    });
    const salt = await bcrypt.genSalt(10);
    client.password = await bcrypt.hash(password, salt);
    console.log(`client.password: ${client.password}`);
    // console.log(`salt: ${salt}`);
    // console.log(`password: ${user.password}`);
    client.accountStatus = "hold";
    client.verificationToken = crypto.randomBytes(32).toString("hex");
    await client.save();
    console.log(client);
    const url = `http://localhost:5173/api/clients/${client.id}/verify/${client.verificationToken}`;
    console.log(`url: ${url}`);
    const mailOptions = {
      from: process.env.EMAIL,
      to: client.email,
      subject: "Email Verification",
      text: `You need to verify email in order to activate your account. Click the below link to activate\n\n${url}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error: ${error}`);
        return res
          .status(401)
          .json({errors:"Error while sending email verification mail to client"});
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
    res.status(200).json({
      success: true,
      message:
        "Registration success. Email verification  mail sent successfully",
      url: url,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({errors:"Error"});
  }
};

/* To let the client to login */
const clientLogin = async (req, res) => {
  console.log(req.body);
  const { username } = req.body;
  const password = req.header("password");
  console.log(password);
  try {
    const client = await Clients.findOne({ username });
    if (client.accountStatus === "hold") {
      console.log("Your account is on hold");
      client.verificationToken = crypto.randomBytes(32).toString("hex");
      await client.save();
      console.log(client);
      const url = `http://localhost:5173/api/clients/${client.id}/verify/${client.verificationToken}`;
      const mailOptions = {
        from: process.env.EMAIL,
        to: client.email,
        subject: "Email Verification",
        text: `You need to verify email in order to activate your account. Click the below link to activate\n\n${url}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Error: ${error}`);
          return res
            .status(401)
            .send("Error while sending email verification mail to client");
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
      return res.status(400).json({
        errors: "Verification Email sent to your mail",
      });
    } else {
      if (!bcrypt.compareSync(password, client.password)) {
        return res.status(400).json({errors:"Invalid password."});
      }
      console.log(
        `bcrypt.compareSync(password, client.password):${bcrypt.compareSync(
          password,
          client.password
        )}`
      );
      const payload = {
        client: {
          id: client._id,
        },
      };
      console.log(payload);

      const tokens = await Tokens.find({}, "client_id").exec();
      console.log(tokens);
      console.log("test3");
      /* It is true, even tokens is "empty" i.e [] */
      if (tokens) {
        let arrClientID = tokens.map((client) => client.client_id);
        const clientIDExists = arrClientID.includes(client.client_id);
        console.log(`clientIDExists: ${clientIDExists}`);
        let accessToken;
        let refreshToken;
        /* Checks whether the clientID exists in Tokens collection or not */
        if (!clientIDExists) {
          console.log("clientID not exists in Token collection");
          accessToken = generateAccessToken(payload);
          refreshToken = await generateRefreshToken(payload, client.client_id);
        } else {
          console.log("clientID exists in Token collection");
          /* To find refreshToken based on clientID */
          const token = await Tokens.findOne({
            client_id: client.client_id,
          }).exec();
          console.log(`refresh token: ${token.token}`);
          jwt.verify(
            token.token,
            process.env.REFRESH_SECRET_KEY,
            async (err, user) => {
              if (err) return res.sendStatus(403);
              accessToken = generateAccessToken(payload);
              refreshToken = token.token;
            }
          );
        }
        const now = new Date();
        const login_timestamp = now.toISOString();
        client.last_login = login_timestamp;
        await client.save();
        return res.status(200).json({
          success: true,
          message: "Login success",
          accessToken,
          refreshToken,
          client,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({errors:"Error"});
  }
};

/* To let the client to logout */
const clientLogout = async (req, res) => {
  /* The "x-auth-token" header contains accessToken of client */
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ errors: "No token provided" });
  }
  try {
    const blacklistedToken = new Blacklist({
      token,
      expiresAt: new Date(Date.now() + 3600 * 1), // Token expiration time (1 mnt for example)
    });
    await blacklistedToken.save();
    res.json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({errors:"Server error"});
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const client = await Clients.findOne({ email: email });
    console.log(client);
    const otp = generateOTP();
    console.log(otp);
    client.resetPasswordOTP = otp;
    // client.resetPasswordOTPExpiry = Date.now() + 3600000; // 1 hour from now
    await client.save();
    /* To send reset mail with OTP to client's mail */
    const mailOptions = {
      from: process.env.EMAIL,
      to: client.email,
      subject: "Password Reset",
      text: `We have received a request to reset your password. Please reset your password using the OTP below.\nOTP : ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error: ${error}`);
        return res.status(401).send("Error while sending reset mail to client");
      } else {
        console.log(`Email sent: ${info.response}`);
        res.json({
          success: true,
          message: "Password reset otp sent to your email",
          otp: otp,
        });
      }
    });
  } catch (error) {
    //   console.log(error);
    res.status(500).send({errors:"Internal server error!!!"});
  }
};

const resetPassword = async (req, res) => {
  console.log("Called from resetPassword() controller");
  /* We don't need OTP here */
  const { email } = req.body;
  console.log(email);
  const new_password = req.header("new-password");
  console.log(`new_password: ${new_password}`);
  const confirm_password = req.header("confirm-password");
  console.log(`confirm_password: ${confirm_password}`);
  try {
    const client = await Clients.findOne({ email });
    console.log(client);
    const salt = await bcrypt.genSalt(10);
    console.log(`Old password HASH: ${client.password}`);
    client.password = await bcrypt.hash(new_password, salt);
    console.log(`New password HASH: ${client.password}`);
    client.resetPasswordOTP = "";
    await client.save();
    /* To send success message once password is changed */
    const mailOptions = {
      from: process.env.EMAIL,
      to: client.email,
      subject: "Password Reset Successfully",
      text: `Your request processed successfully. You can login with your new password.`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error: ${error}`);
        return res.status(401).send("Error while sending reset success mail");
      } else {
        console.log(`Email sent: ${info.response}`);
        res.json({
          success: true,
          message: "Password reset successful",
          client,
        });
      }
    });
  } catch (error) {
    res.status(500).send({errors:"Internal server error!!!"});
  }
};

const verifyEmail = async (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  const token = req.params.token;
  try {
    const client = await Clients.findOne({ _id: id });
    if (!client) {
      return res.send({ errors: "Invalid link" });
    }
    const verifyLink = await Clients.findOne({
      _id: id,
      verificationToken: token,
    });
    if (!verifyLink) {
      return res.send({ errors: "Invalid link" });
    }
    client.accountStatus = "activated";
    client.verificationToken = "";
    await client.save();
    console.log("verifyEmail controller");
    console.log(client);
    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ errors: "Internal Server Error" });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ errors: "Token is required" });
  const refreshToken = await Tokens.findOne({ token, type: "refresh" });

  /*
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.user.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const newAccessToken = jwt.sign(payload, jwtSecret, { expiresIn: 3600 });
    const newRefreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: refreshTokenExpire,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ error: "Invalid refresh token" });
  } 
  */
 
};

const test = (req, res) => {
  /*
  // To create timestamps
  const now = new Date();
  const timestamp = now.toISOString();
  res.send(timestamp);
  */
  console.log("Test controller");
  const data = req.body;
  const file = req.file;

  /*
  REASON FOR USING:
  Form data: [Object: null prototype] {
  username: 'mohammedzaheer',        
  password: 'zaheer123',
  name: 'Mohammed zaheer f',
  email: 'zaheer@gmail.com',
  phone: '1234561230',
  address: '10, fairlands, Salem'
  }
  The [Object: null prototype] notation is a way of showing that 
  the object has no prototype. This usually happens when the object 
  is created in a non-standard way, such as directly from 
  JSON or using Object.create(null). In your case, it indicates 
  that the object is not inheriting from Object.prototype, which is 
  the default prototype for all objects in JavaScript
  */

  // Convert the data to a regular object Using Object.assign()
  const regularData = Object.assign({}, data);
  // OR
  // Convert the data to a regular object Using Spread Syntax
  // const regularData = { ...data };

  console.log("Form data:", regularData);
  console.log("Uploaded file:", file);
  res.json({ message: "Registration successful!", data, file });
};

const test1 = (req, res) => {
  const data = req.body;
  const regularJsonFormat = { ...data };
  console.log("Form data:", regularJsonFormat);
  res
    .status(200)
    .json({ message: " You logged in successfully!", data: req.body });
};

const test2 = async (req, res) => {
  try {
    const clients = await Clients.find({}, "client_id").exec();
    console.log(clients);
    let arrID = clients.map((client) => client.client_id);
    console.log(arrID);
  } catch (error) {
    console.error("Error fetching client IDs:", error);
  }
};

const test3 = (req, res) => {
  console.log(req.body); // This should now contain the form data
  // Handle your logic here
  res.send({ message: "Data received" });
};

const clientDetails = async (req, res) => {
  const token = req.header('x-auth-token');
      if (!token) {
          return res.status(400).json({ error: 'No token provided' });
      }

      let decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!decoded) {
          return res.status(400).json({ error: 'Invalid token' });
      }

      console.log('Decoded token:', decoded);
  try {
      const client = await Clients.findOne({_id : decoded.client.id });
      if (!client) {
          return res.status(404).json({ error: 'Client not found' });
      }

      return res.status(200).json({ client });
  } catch (error) {
      console.error('Error in clientDetails:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  createClientController,
  clientLogin,
  clientLogout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  test,
  test1,
  test2,
  test3,
  clientDetails
};
