import jwt from 'jsonwebtoken';
import transporter from '../../config/nodemailer.js';
import AgentToken from '../../models/agentModels/agentToken.js';

import config from 'config';
const JWT_SECRET = config.get('JWT_SECRET');
const refreshToken = config.get('refreshToken');
const refreshTokenExpire = config.get('refreshTokenExpire');

const generateAccessToken = (agent) => {
  console.log(agent);
  return jwt.sign( agent, JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = async (agent) => {
  const refreshToken = jwt.sign(agent, JWT_SECRET);
  await AgentToken.create({ agent_id: agent.agent_id, token: refreshToken, type:{ expiresIn: refreshTokenExpire } });
  return refreshToken;
};

const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
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

const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export { generateAccessToken, generateRefreshToken, sendOTP, generateOTP }