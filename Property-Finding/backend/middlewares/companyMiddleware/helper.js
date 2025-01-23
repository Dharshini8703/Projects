import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import  Token  from '../../models/companyModels/token.js';
import  config  from 'config';
import nodemailer from 'nodemailer';

const JWT_SECRET = config.get('JWT_SECRET');
const refreshToken = config.get('refreshToken');
const refreshTokenExpire = config.get('refreshTokenExpire');


const generateAccessToken = (cmp) => {
  console.log(cmp);
  return jwt.sign(cmp,JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = async (cmp) => {
  const refreshToken = jwt.sign(cmp,JWT_SECRET);
  await Token.create({ cmpUser_id: cmp.cmpUser_id, token: refreshToken, type:{ expiresIn: refreshTokenExpire } });
  return refreshToken;
};


//Generate OTP
export const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 5; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};


//Email send 
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: 'nsathiya757@gmail.com',
    to,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);  
    console.log('OTP sent');
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};


export {generateAccessToken,generateRefreshToken};
