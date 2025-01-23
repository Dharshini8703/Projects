import Admin from "../../models/adminModels/adminModel.js";
import Token from "../../models/adminModels/tokenModel.js";
import Blacklist from "../../models/adminModels/blacklistModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import sendEmail from "../../middlewares/adminMiddlewares/sendMail.js";
import { generateAccessToken, generateRefreshToken, generateOtp, adminIdGenerate } from "../../middlewares/adminMiddlewares/generate.js";
import { deleteImage } from '../../middlewares/adminMiddlewares/multer.js';

//for register new admin
const adminRegister = async (req, res) => {
    const {name, phone_number, email, username} = req.body;
    const password = req.header('password');
    const {filename, path: filepath} = req.file;
    const admin_id = await adminIdGenerate();
    try {
        //for password encrypt
        const hashedPassword = bcrypt.hashSync(password,10);
        const admin = await Admin.create({
            admin_id: admin_id,
            name: name,
            phone_number: phone_number,
            email: email,
            imagename: filename,
            imagepath: filepath,
            username: username,
            password: hashedPassword
        });
        const token = await generateRefreshToken({admin_id: admin.admin_id, username: admin.username});
        const url = `http://localhost:5173/admin/${admin.admin_id}/verify/${token}`;
        sendEmail(email, url);
        res.json({ message: "Register successfull. Verify link sent to mail", admin : admin});
    }
    catch(error) {
        deleteImage(req.file.path);
        res.json({error: error.message});
    }
}

//for verify email
const verifyEmail = async (req, res) => {
    const admin_id = req.params.id;
    const tokenValue = req.params.token;
    try {
        const admin = await Admin.findOne({ admin_id });
        if (!admin) {
            return res.status(400).json({ error: "Email not found" });
        }
        const token = await Token.findOne({ admin_id: admin.admin_id, token: tokenValue });
        if (!token) {
            return res.status(400).json({ error: "Invalid link" });
        }
        admin.verified = true;
        await admin.save();
        await token.deleteOne();
        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

//for admin login using jwt
const adminLoginJwt = async (req, res) => {
    const {username} = req.body;
    const password = req.header('password');
    try {
        const admin = await Admin.findOne({ username });
        let accessToken;
        let refreshToken;
        if (!admin) {
            return res.status(400).json({ error: "Admin not Found."});
        }
        if (admin.verified !== true) {
            return res.status(400).json({ error: "Verify signup through email to login ."});
        }
        if(!bcrypt.compareSync(password, admin.password)) {
            return res.status(400).json({ error: "Password Incorrect."});
        }
        const token = await Token.findOne({ admin_id: admin.admin_id});
        if (!token) {
            accessToken = generateAccessToken({admin_id: admin.admin_id, username: admin.username});
            refreshToken = await generateRefreshToken({admin_id: admin.admin_id, username: admin.username});
        }
        else {
            let decoded = jwt.verify(token.token, process.env.REFRESH_SECRET_KEY)
            if (!decoded) {
                return res.status(400).json({error: "Invalid token"});
            }
            accessToken = generateAccessToken({ admin_id: decoded.admin_id, username: decoded.username });
            refreshToken = token.token;
        }
        res.status(200).json({message:"login successful",token : accessToken, refreshToken: refreshToken });
    }
    catch(error) {
        res.status(500).send({error: error.message});
    }
}

//for forget password using otp
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ error: "Admin not found" });
        }
        const otp = generateOtp();
        admin.resetPasswordOtp = otp;
        await admin.save();
        res.cookie('email', email);
        sendEmail(email , otp);
        res.status(200).json({message:"OTP sent successfully"});
    }
    catch(error) {
        res.status(500).send({error: error.message});
    }
}

//for reset password using otp
const resetPassword = async (req, res) => {
    const email = req.cookies.email;
    const { otp } = req.body;
    const newPassword = req.header('newPassword');
    const confirmPassword = req.header('confirmPassword');
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
          return res.status(400).json({ error: 'Admin not found' });
        }
        if (otp !== admin.resetPasswordOtp) {
          return res.status(400).json({ error: 'Invalid OTP' });
        }
        admin.password = bcrypt.hashSync(newPassword, 10);
        admin.resetPasswordOtp = '';
        await admin.save();
        res.clearCookie('email');
        res.status(200).json({ message: 'Password reset successful' });
    } 
    catch (err) {
        res.status(500).send({error: 'Server error'});
    }
}

//for logout
const logout = async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(400).json({ error: 'No token' });
    }
    try {
        const blacklistedToken = new Blacklist({
            token,
            expiresAt: new Date(Date.now() + 3600 * 1)
        });
        await blacklistedToken.save();
        res.status(200).json({ message: 'User logged out successfully' });
    }
    catch (err) {
        res.status(500).json({error:'Server error'});
    }
}

//for admin home(temp)
const adminDetails = async (req, res) => {
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
        const admin = await Admin.findOne({ admin_id: decoded.admin_id });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        return res.status(200).json({ admin });
    } catch (error) {
        console.error('Error in adminDetails:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



export {adminRegister, adminLoginJwt, logout , forgotPassword, resetPassword, verifyEmail, adminDetails};