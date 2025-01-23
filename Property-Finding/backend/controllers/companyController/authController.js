import bcrypt from 'bcryptjs';
import  Company  from '../../models/companyModels/company.js';
import CompanyRoles from '../../models/companyModels/companyRoles.js';
import CompanyList from '../../models/companyModels/companyList.js';
import  Token  from '../../models/companyModels/token.js';
import Blacklist from '../../models/companyModels/Blacklist.js';
import { generateAccessToken,generateRefreshToken,generateOTP,sendOTP,transporter } from '../../middlewares/companyMiddleware/helper.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url'; 
// import dotenv from 'dotenv';  
import { promises as fsPromises } from 'fs';   
import  config  from 'config'; 
// import { lightGreen } from '@mui/material/colors';
// import { LocationSearchingOutlined } from '@mui/icons-material';
 
const JWT_SECRET = config.get('JWT_SECRET');
const refreshToken = config.get('refreshToken'); 
const refreshTokenExpire = config.get('refreshTokenExpire');

// dotenv.config(); 

//file module
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

//register 
export const register = async (req, res) => {   
    const { cmp_name, first_name, last_name, username, email, phone_number, address} =req.body;
    const password = req.header('password'); 
    const {filename,path:filepath} = req.file;
    try {
      //automatic id generate
      const cmp_id = await companyId();
      const user_id = await cmpUserId(cmp_name, cmp_id);
      //password hash function
      const hashedPassword = bcrypt.hashSync(password, 10);
      const company =  await Company.create({
        cmp_id, 
        cmp_name,
        address,
        image_name: filename,
        image_path: filepath
      });
      const companyList =  await CompanyList.create({
        cmp_id,
        cmp_name
      });
      const companyRoles =  await CompanyRoles.create({
        cmp_id,
        user_id,
        first_name,
        last_name,
        phone_number,
        email,
        image_name: filename,
        image_path: filepath,
        username,
        password: hashedPassword,
        address, 
        role: "CEO"
      });
      const token = await generateRefreshToken({cmpUser_id: companyRoles.user_id, username: companyRoles.username});
      console.log(token);
      const url = `http://localhost:5173/company/${companyRoles.user_id}/verify/${token}`;
      const mailOptions = {
        from: process.env.EMAIL,
        to: companyRoles.email,  
        subject: 'Verification Email',
        text: `Verify Email Link is : ${url}`
      };
      await transporter.sendMail(mailOptions);
      console.log(url);
      res.json({company, companyList, companyRoles, url}); 
    } 
    catch(error) { 
      deleteImage(req.file.path);
      console.log(error);
      res.json({error: error.message});
    }
};

//verify email for registration 
export const verifyEmail = async (req, res) => {  
    const user_id = req.params.id;
    const tokenValue = req.params.token;
    try { 
    // Find company based on cmp_id
    const company = await CompanyRoles.findOne({ user_id }); 
    if (!company) {
      return res.status(404).json({ error: "email not found" });
    }
    // Find token associated with company
    const token = await Token.findOne({ cmpUser_id: company.user_id, token: tokenValue });
    if (!token) {
      return res.status(404).json({ error: "Invalid link" });
    }
    // Update company's verified status
    company.email_verified=true;
    await token.deleteOne();
    await company.save();
    res.status(200).json({ message: "Email verified successfully" });
  } 
  catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } 
};

// Id automatic generation
const companyId = async () => {
  const cmp = await Company.find({}).select('cmp_id');
  if (cmp.length === 0) {
    return "CMP1001";
  } 
  else {
    const lastCmp = cmp[cmp.length - 1].cmp_id;
    const companyNumeric = parseInt(lastCmp.replace("CMP", "",10));
    const newCompanyId = "CMP" + (companyNumeric + 1); 
    return newCompanyId;
  }
};

// Id automatic generation
const cmpUserId = async (cmp_name, cmp_id) => {
  let cmpName = cmp_name.slice(0,3);
  const user = await CompanyRoles.find({cmp_id}).select('user_id');
  if (user.length === 0) {
    return `${cmpName}1001`;
  } 
  else {
    const lastUser = user[user.length - 1].user_id;
    cmpName = lastUser.slice(0, 3);
    const userNumeric = parseInt(lastUser.replace(cmpName, "", 10));
    const newUserId = cmpName + (userNumeric + 1); 
    return newUserId;
  }
};
 
//Login process
export const login = async (req, res) => {
  let accessToken; 
  let refreshToken;
  const { username} = req.body;
  const password = req.header('password');
  try {
    const cmpUser = await CompanyRoles.findOne( { username } ); 
    if (!cmpUser) {
      return res.status(400).json({error: 'User not found.'});
    }
    if (cmpUser.email_verified !== true) {
      return res.status(400).json({error: 'Verify email to login'});
    }
    if (!bcrypt.compareSync(password, cmpUser.password)) {
      return res.json({error:'username or password incorrect'});
    } 
    const token = await Token.findOne({ cmpUser_id: cmpUser.user_id});
    if (!token) {
      accessToken = generateAccessToken({cmp_id: cmpUser.cmp_id, cmpUser_id: cmpUser.user_id, username: cmpUser.username});
      refreshToken = await generateRefreshToken({cmp_id: cmpUser.cmp_id, cmpUser_id: cmpUser.user_id, username: cmpUser.username});
    }
    else{
      let decoded = jwt.verify(token.token,JWT_SECRET); 
      console.log(decoded);
      if(!decoded){
          return res.json({error: "Invalid token"});
      }
      accessToken = generateAccessToken({cmp_id: decoded.cmp_id, cmpUser_id: decoded.cmpUser_id, username: decoded.username});
      refreshToken = token.token;
    }
    res.json({message:"login successful",accessToken,refreshToken, cmp_id: cmpUser.cmp_id});
  } 
  catch (error) { 
    console.log(error);
    res.status(500).json({ error: error.message });
  } 
};

// forget password
export const forgetpassword= async(req,res)=>{
  const {email } = req.body; 
  try{
    const user = await CompanyRoles.findOne({ email } ); 
    if (!user) {
      return res.status(400).json({ error: 'User not found' }); 
    } 
    const otp = generateOTP();
    // Save OTP to user in database (for verification)
    user.resetPasswordOtp = otp;
    await user.save();
    res.cookie('email', user.email);
    await sendOTP(user.email, otp);
    res.json({ message: 'OTP sent to your email' }); 
    }
  catch(error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

//reset password
export const resetpassword=async(req,res)=>{
  const email = req.cookies.email;
  const { otp } = req.body;
  const newPassword = req.header('newPassword');
  const confirmPassword = req.header('confirmPassword');
  try{
    const user = await CompanyRoles.findOne({email});
    if(!user){
      return res.status(400).json({error:'user not found'}) 
    } 
    if (otp !== user.resetPasswordOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    //password hash function
    user.password = await bcrypt.hash(newPassword, 10);
    // Clear the OTP after successful reset
    user.resetPasswordOtp = ''; 
    await user.save(); 
    res.clearCookie('email');
    const mailOptions = { 
      from: process.env.EMAIL,
      to: user.email, 
      subject: "Password Reset Successfully",
      text: `Your request processed successfully. You can login with your new password.`,
    };
    transporter.sendMail(mailOptions, (error, info) => { 
    if (error) {
      console.log(`Error: ${error}`); 
    } 
    else {
      console.log(`Email sent: ${info.response}`);
      res.json({ message: 'Password reset successful', user });
    }
    });
  }
  catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//delete image for wrong data entry in registration
export const deleteImage = async (filepath) => {
  try {
      await fsPromises.unlink(filepath);
      console.log(`File ${filepath} deleted successfully.`);
  } catch (err) {
      console.error('Error deleting file ');
  }
};

//logout 
export const logout = async (req, res) => {
  const token = req.header('x-auth-token');
  console.log(token);
  console.log('in blacklist', token);
  if (!token) {
    return res.status(400).json({ msg: 'No token provided' });
  }
  try {
    const blacklistedToken = new Blacklist({ 
      token,
      expiresAt: new Date(Date.now() + 3600 * 1),// Token expiration time (1 mnt for example)
    });
    await blacklistedToken.save();
    res.json({ message: 'User logged out successfully' });
  }
  catch (err) {
    console.error(err);  
    res.status(500).send('Server error');
  }
};  

//get company details with owner details
export const getCompanyDetails = async (req, res) => {
  const token = req.header('token');
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }
  try {
    let decoded = jwt.verify(token , JWT_SECRET)
    if(!decoded){
      return res.json({error: "Invalid token"});
    }
    console.log("decoded-->",decoded)
    const company = await Company.findOne({ cmp_id: decoded.cmp_id });
    const companyOwner = await CompanyRoles.findOne({cmp_id: company.cmp_id, role: "CEO"});
    if (!company) {
      return res.status(400).send('Company not found.');
    } 
    if (!companyOwner) {
      return res.status(400).send('Company Owner details not found.');
    }
    res.json({ message: 'company details retrieved successfully', company, companyOwner });
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
};

//getAllCompany details
export const getAllCompanyDetails=async (req,res)=>{
  
}

//company details update
export const companyDetailsUpdate = async (req, res) => { 
  const { cmp_name, address, description, proof_id} =req.body;  
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
  const cmp_id = decoded.cmp_id;
  try {
    const updateFields = { 
      cmp_name,
      address,
      description,
      proof_id
    };
    if (imgExist) {
      updateFields.image_name = imageName;
      updateFields.image_path = imagePath;
    }
    if (docExist) {
      updateFields.proofImage_name = documentName;
      updateFields.proofImage_path = documentPath;
    }

    const company =  await Company.updateOne({cmp_id},updateFields);
    res.status(200).json({message: "updated successfully", company})
  }
  catch(error) {
    deleteImage(imagePath);
    deleteImage(documentPath);
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}

//new user create under company
export const createCompanyUser = async (req, res) => {
  const { first_name, last_name, username, email, phone_number, address, role} =req.body;
  const password = req.header('password');
  let imageName ;
  let imagePath ;
  let imgExist = false;
  if (req.file) {
    imageName = req.file.filename;
    imagePath = req.file.path;
    imgExist = true;
  }
  const token = req.header('token');
  if(!token) {
    return res.json({error: "No token"});
  }
  let decoded = jwt.verify(token,JWT_SECRET); 
  if(!decoded){
    return res.json({error: "Invalid token"});
  }
  const cmp_id = decoded.cmp_id;
  try {
    const company = await Company.findOne({cmp_id});
    if (company.cmp_verified === true ) {
      const user_id = await cmpUserId(company.cmp_name, company.cmp_id);
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        cmp_id: company.cmp_id,
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        email: email,
        username: username,
        password: hashedPassword,
        address: address,
        role: role
      }
      if (imgExist) {
        newUser.image_name = imageName;
        newUser.image_path = imagePath;
      }
      const companyRoles =  await CompanyRoles.create(newUser);
      const verifyToken = await generateRefreshToken({cmpUser_id: companyRoles.user_id, username: companyRoles.username});
      console.log(verifyToken);
      const url = `http://localhost:5173/company/${companyRoles.user_id}/verify/${verifyToken}`;
      const mailOptions = { 
        from: process.env.EMAIL,
        to: companyRoles.email,  
        subject: 'Verification Email',
        text: `Verify Email Link is : ${url}`
      };
      await transporter.sendMail(mailOptions);
      return res.status(200).json({message: "user successfully created", companyRoles});
    }
    else {
      return res.status(400).json({error: "Verify company to continue"});
    }
  }
  catch(error) {
    deleteImage(imagePath);
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}

//get already existing company data in form to update
export const getUpdateDetails = async (req, res) => {
  const token = req.header('token');
  if(!token) {
    return res.json({error: "No token"}); 
  }
  try {
    let decoded = jwt.verify(token,JWT_SECRET); 
    console.log(decoded);
    if(!decoded){
        return res.json({error: "Invalid token"});
    }
    const cmp_id = decoded.cmp_id;
    const company = await Company.findOne({cmp_id});
    res.status(200).json({company});
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}
 
//get user list in company
export const getCmpUserDetails = async (req, res) => {  
  const token = req.header('token'); 
  if(!token) {  
    return res.json({error: "No token"});  
  } 
  try { 
    let decoded = jwt.verify(token,JWT_SECRET);   
    console.log(decoded);
    if(!decoded){
        return res.json({error: "Invalid token"});
    }
    const cmp_id = decoded.cmp_id;
    const cmpUser = await CompanyRoles.find({cmp_id});
    res.status(200).json({cmpUser});
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}

//get specific user details
export const getSingleUserDetails = async (req, res) => {
  const token = req.header('token');
  if(!token) {
    return res.json({error: "No token"});
  }
  try { 
    let decoded = jwt.verify(token,JWT_SECRET); 
    console.log(decoded);
    if(!decoded){
        return res.json({error: "Invalid token"}); 
    }
    const cmpUser_id = decoded.cmpUser_id;
    console.log(cmpUser_id);
    const cmpUser = await CompanyRoles.findOne({user_id: cmpUser_id});
    res.status(200).json({cmpUser});
  }
  catch(error) { 
    console.log(error);
    res.status(500).json({error: "Internal server error"}); 
  }
} 

//for update user details 
export const updateSingleUser = async (req, res) => {
  const { first_name, last_name, username, email, phone_number, address, role} =req.body;
  console.log(req.body); 
  let imageName ;
  let imagePath ;
  let imgExist = false;
  if (req.file) {
    imageName = req.file.filename;
    imagePath = req.file.path;
    imgExist = true; 
  }
  const token = req.header('token');
  if(!token) {
    return res.json({error: "No token"})
  }
  let decoded = jwt.verify(token,JWT_SECRET); 
  if(!decoded){
      return res.json({error: "Invalid token"});
  }
  const cmpUser_id = decoded.cmpUser_id;
  try {
    const user = await CompanyRoles.findOne({user_id: cmpUser_id});
    if(!user) {
      return res.status(400).json({error: "No user found"});
    }
    const updateDetails = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      email: email,
      username: username,
      address: address,
      role: role
    }
    if (imgExist) {
      updateDetails.image_name = imageName;
      updateDetails.image_path = imagePath;
    }
    const companyRoles =  await CompanyRoles.updateOne({ user_id: cmpUser_id}, updateDetails);
    return res.status(200).json({message: "user successfully updated", companyRoles});
  }
  catch(error) {
    deleteImage(imagePath);
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}
 
//for role
export const roles = async (req, res) => {
  const roles = {
    role1: "Director",
    role2: "Manager",
    role3: "Super Admin",
    role4: "Admin"
  }
  res.status(200).json(roles);
}