import bcrypt from "bcryptjs";
import AgentPersonalDetails from "../../models/agentModels/agentPersonalInfo.js";
import transporter from "../../config/nodemailer.js";
import path from "path";
import { fileURLToPath } from "url";
import {
  generateAccessToken,
  generateRefreshToken,
  sendOTP,
  generateOTP,
} from "../../middlewares/agentMiddleware/authToken.js";
import jwt from "jsonwebtoken";
import AgentToken from "../../models/agentModels/agentToken.js";
import dotenv from "dotenv";
import { promises as fsPromises } from "fs";
import AgentBlacklist from "../../models/agentModels/agentBlacklist.js";
import config from "config";
import AgentOfficialDetails from "../../models/agentModels/agentOfficialInfo.js";

const JWT_SECRET = config.get('JWT_SECRET');
const refreshToken = config.get('refreshToken');
const refreshTokenExpire = config.get('refreshTokenExpire');

dotenv.config();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

//delete image if any error while register or update
export const deleteImage = async (filepath) => {
  try {
    await fsPromises.unlink(filepath);
    console.log(`File ${filepath} deleted successfully.`);
  } catch (err) {
    console.error("Error deleting file ");
  }
};

// agent registration
const registerAgent = async (req, res) => {
    const { username, email, first_name, last_name, phone_number, address, language, nationality } = req.body;
    const password = req.header('password');
    const { filename, path: filepath } = req.file;
    try {
      const agent_id = await agentid();
      const hashedPassword = bcrypt.hashSync(password, 10);
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const agent = await AgentPersonalDetails.create({
        agent_id,
        username,
        email,
        first_name,
        last_name,
        phone_number,
        address,
        password: hashedPassword,
        language,
        nationality,
        image_name: filename,
        image_path: filepath
      });
      const agentOfficial = await AgentOfficialDetails.create({
        agent_id,
        experience: year
      });
      const token = await generateRefreshToken({agent_id: agent.agent_id, username: agent.username});
        console.log(token);
        const url = `http://localhost:5173/agent/verifyEmail/${agent.agent_id}/verify/${token}`;
        const mailOptions = {
          from: process.env.EMAIL, 
          to: agent.email, 
          subject: 'verify email',
          text: url
        };
        await transporter.sendMail(mailOptions);
        res.json({message:"Agent registration successful", agent, agentOfficial, url});
    } 
    catch (error) {
      deleteImage(filepath);
      console.log(error);
      res.status(500).json({ error: error.message });
    }
}

// auto generate AGENT ID
const agentid = async(req,res) => {
  const agent = await AgentPersonalDetails.find({}).select('agent_id');
  if (agent.length==0){
      return "AGE1001";
  } 
  else {
    const lastAgent = agent[agent.length-1].agent_id;
    const agentNumeric = parseInt(lastAgent.replace("AGE","",10));
    const newAgentId = "AGE" + (agentNumeric + 1);
    return newAgentId;
  }
}

//verify Email
const verifyEmail = async (req, res) => {
  const agent_id = req.params.id;
  const tokenValue = req.params.token;
  console.log(agent_id);
  console.log(tokenValue);
  try { 
    const agent = await AgentPersonalDetails.findOne({ agent_id });
    if (!agent) {
      return res.status(404).send({ message: "agent not found" });
    }
    const token = await AgentToken.findOne({
      agent_id: agent.agent_id,
      token: tokenValue,
    });
    if (!token) {
      return res.status(404).send({ message: "Invalid link" });
    }
    agent.email_verified = true;
    await agent.save();
    await token.deleteOne();
    res.status(200).send({ message: "Email verified successfully" });
  } 
  catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//agent login
const login = async (req, res, next) => {
  let accessToken;
  let refreshToken;
  const { username } = req.body;
  const password = req.header("password");
  try {
    const currentDate = new Date();
    const loginDate = currentDate.toISOString();
    const agent = await AgentPersonalDetails.findOne({ username });
    if (!agent) {
      return res.status(400).json({error:"User not found!"});
    }
    if (!bcrypt.compareSync(password, agent.password)) {
      return res.json({error:"Incorrect password"});
    }
    if (agent.email_verified !== true) {
      return res.json({error:"Verify email to login"});
    }
    const agentOfficial = await AgentOfficialDetails.findOne({agent_id: agent.agent_id});
    if (!agentOfficial) {
      return res.status(400).json({error: "agent official details not found"});
    }
    const token = await AgentToken.findOne({ agent_id: agent.agent_id });
    if (!token) {
      accessToken = generateAccessToken({ agent_id: agent.agent_id });
      refreshToken = await generateRefreshToken({ agent_id: agent.agent_id });
    } else {
      let decoded = jwt.verify(token.token, JWT_SECRET);
      if (!decoded) {
        return res.json({ error: "Invalid token" });
      }
      accessToken = generateAccessToken({ agent_id: decoded.agent_id });
      refreshToken = token.token;
    }
    agentOfficial.last_login = loginDate;
    await agentOfficial.save();
    res
      .status(200)
      .json({ message: "Logged In successfully", accessToken, refreshToken });
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const agent = await AgentPersonalDetails.findOne({ email });
    if (!agent) {
      return res.status(401).json({ error: "Agent not found" });
    }
    const otp = generateOTP();
    agent.resetPasswordOtp = otp;
    await agent.save();
    res.cookie("email", email);
    await sendOTP(agent.email, otp);
    res.json({ message: "OTP sent to your email" });
  } 
  catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { otp } = req.body;
  const newPassword = req.header('newPassword');
  const confirmPassword = req.header('confirmPassword');
  const email = req.cookies.email;
  try {
    const agent = await AgentPersonalDetails.findOne({ email });
    console.log(agent);
    if (!agent) {
      return res.status(400).json({ error: "agent not found" });
    }
    if (otp !== agent.resetPasswordOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    const salt = await bcrypt.genSalt(10);
    agent.password = await bcrypt.hash(newPassword, salt);
    agent.resetPasswordOtp = "";
    await agent.save();
    const mailOptions = {
      from: process.env.EMAIL,
      to: agent.email,
      subject: "Reset successfully",
      text: `Your password reset successfully`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(400).json({ error: error.message });
  }
};

// agent logout
const logout = async (req, res) => {
  const token = req.header("x-auth-token");
  console.log("in blacklist", token);
  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }
  try {
    const blacklistedToken = new AgentBlacklist({
      token,
      expiresAt: new Date(Date.now() + 3600 * 1),
    });
    await blacklistedToken.save();
    res.json({ message: "Agent logged out successfully" });
  } catch (err) {
    console.log(error);
    res.status(500).json({error:"Server error"});
  }
};

//get Specific agent details
const getAgentDetails = async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }
  let decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded) {
    return res.json({ error: "Invalid token" });
  }
  try {
    const agentDetails = await AgentPersonalDetails.aggregate([
      { $match: { agent_id: decoded.agent_id } },
      {
        $lookup: {
          from: 'agentofficialdetails',
          localField: 'agent_id',
          foreignField: 'agent_id',
          as: 'agentofficialdetails'
        }
      },
      {
        $project: {
          agent_id: 1,
          first_name: 1,
          last_name: 1,
          email: 1,
          phone_number: 1,
          language: 1,
          nationality: 1,
          image_name: 1,
          image_path: 1,
          address: 1,
          agentofficialdetails: 1
        }
      }
    ]);
    if (!agentDetails.length) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: "Agent details retrieved successfully", agentDetails });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({error:"Server error"});
  }
};

//for update agent details
const updateAgentDetails = async (req, res) => {
  const {username, first_name, last_name, email, phone_number, address, language, nationality, company_name, license_number, license_type, license_expiry} = req.body;
  let imageName ;
  let imagePath ;
  let documentName ;
  let documentPath ;
  let imgExist = false;
  let docExist = false;
  if (req.files.logo) {
    imageName = req.files.logo[0].filename;
    imagePath = req.files.logo[0].path;
    imgExist = true;
  }
  if (req.files.document) {
    documentName = req.files.document[0].filename;
    documentPath = req.files.document[0].path;
    docExist = true;
  }
  const token = req.header('x-auth-token');
  if(!token) {
    return res.json({error: "No token"});
  } 
  let decoded = jwt.verify(token,JWT_SECRET);  
  if(!decoded){  
      return res.json({error: "Invalid token"});
  }
  const agent_id = decoded.agent_id;
  try {
    const personalDetails = {
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      address: address,
      language: language,
      nationality: nationality
    }
    const officialDetails = {
      company_name: company_name,
      license_number: license_number,
      license_type: license_type,
      license_expiry: license_expiry
    }
    if (imgExist) {
      personalDetails.image_name = imageName;
      personalDetails.image_path = imagePath;
    }
    if (docExist) {
      officialDetails.proof_file_name = documentName;
      officialDetails.proof_file_path = documentPath;
    }

    const agentPersonal =  await AgentPersonalDetails.updateOne({agent_id}, personalDetails);
    const agentOfficial =  await AgentOfficialDetails.updateOne({agent_id}, officialDetails);
    res.status(200).json({message: "updated successfully", agentPersonal, agentOfficial})
  }
  catch (error) {
    deleteImage(imagePath);
    deleteImage(documentPath);
    console.log(error);
    res.status(500).json({error:"Server error"});
  }
}

export {
  registerAgent,
  logout,
  login,
  forgotPassword,
  resetPassword,
  getAgentDetails,
  verifyEmail,
  updateAgentDetails
};
