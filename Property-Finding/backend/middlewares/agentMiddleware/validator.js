import {body, header, validationResult} from 'express-validator'
import AgentPersonalDetails from '../../models/agentModels/agentPersonalInfo.js';
import { deleteImage } from '../../controllers/agentController/agentController.js';
import jwt from 'jsonwebtoken';
import config from "config";

const JWT_SECRET = config.get('JWT_SECRET');

//register validation rules
export const registerValidation = [
body('username').notEmpty().withMessage('Username is required')
.isLength({ min: 8, max: 16 }).withMessage('Username must be between 8 and 16 characters'),
body('email').notEmpty().withMessage('Email is required')
.isEmail().withMessage('Invalid email address'),
body('first_name').notEmpty().withMessage('First name is required'),
body('last_name').notEmpty().withMessage('Last name is required'),
body('phone_number').notEmpty().withMessage('Phone number is required')
.matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits only'),
body('address').notEmpty().withMessage('Address is required'),
header('password').notEmpty().withMessage('Password is required')
.isLength({ min: 8, max: 16 })
.matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
.withMessage('Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character')
];

//login validation rules
export const loginValidation = [
    body('username').notEmpty().withMessage('Username is required')
    .isLength({ min: 8, max: 16 }).withMessage('Username must be between 8 and 16 characters'),
    header('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 16 })
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
    .withMessage('Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character')
];

//forgot password validation rules
export const forgotValidation = [
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
];

//reset password validation rules
export const resetValidation = [
    body('otp').notEmpty().withMessage('OTP is required'),
    header('newPassword').notEmpty().withMessage('New password is required')
    .isLength({ min: 8, max: 16 })
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
    .withMessage('Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character'),
    header('confirmPassword').notEmpty().withMessage('Confirm password is required')
    .isLength({ min: 8, max: 16 })
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
    .withMessage('Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character')
];

//agent update validation rules
export const updateAgentValidation = [
    body('first_name').notEmpty().withMessage('First Name is required')
    .isAlpha().withMessage('First Name should be alphabets only'),
    body('last_name').notEmpty().withMessage('Last Name is required')
    .isAlpha().withMessage('Last Name should be alphabets only'),
    body('username').notEmpty().withMessage('User Name is required')
    .isLength({ min: 8}).withMessage('Username must be above 8 characters')
    .isLength({ max: 16}).withMessage('Username must be below 16 characters'),
    body('address').notEmpty().withMessage('Address is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
    body('phone_number').notEmpty().withMessage('Phone Number is required').matches(/^[0-9]{10}$/).withMessage('contact number must be 10 digits only')  
]

//register validate function
export const validateRegister = async (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        deleteImage(req.file.path); 
      }
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ error: errorMessages[0] });
    }
    const { username, phone_number, email} = req.body;
    const existingUsername = await AgentPersonalDetails.findOne({ username });
    if (existingUsername) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Username already exists" });
    }
    const existingEmail = await AgentPersonalDetails.findOne({ email });
    if (existingEmail ) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Email ID already exists" });
    }
    const existingPhone = await AgentPersonalDetails.findOne({ phone_number });
    if (existingPhone ) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Phone number already exists" });
    }
    next();
};

//login,forgot validate function
export const validateFunc = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ error: errorMessages[0] });
  }
  next();
};

//Reset password validation
export const validateResetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ error: errorMessages[0] });
    }
    const newPassword = req.header('newPassword');
    const confirmPassword = req.header('confirmPassword');
    if (!req.cookies || !req.cookies.email) {
        return res.status(400).json({ error: 'Email cookie not found' });
    }
    if ( newPassword !== confirmPassword ) {
        return res.status(400).json({ error: "New password and Confirm password must be same" });
    }
    next();
};

//Agent update Validation
export const validateAgentUpdate = async (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.files.logo) {
            deleteImage(req.files.logo[0].path); 
        }
        if (req.files.document) {
            deleteImage(req.files.document[0].path); ; 
        }
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ error: errorMessages[0] });
    }
    const { username, phone_number, email} = req.body;
    const token = req.header('x-auth-token');
    if(!token) {
        if (req.files.logo) {
            deleteImage(req.files.logo[0].path); 
        }
        if (req.files.document) {
            deleteImage(req.files.document[0].path); ; 
        }
        return res.json({error: "No token"});
    }
    let decoded = jwt.verify(token,JWT_SECRET); 
    if(!decoded){
        if (req.files.logo) {
            deleteImage(req.files.logo[0].path); 
        }
        if (req.files.document) {
            deleteImage(req.files.document[0].path); ; 
        }
        return res.json({error: "Invalid token"});
    }
    const agent_id = decoded.agent_id;
    const existingUsername = await AgentPersonalDetails.findOne({ username });
    console.log(existingUsername);
    if(existingUsername) {
      if (existingUsername.agent_id !== agent_id) {
        if (req.files.logo) {
            deleteImage(req.files.logo[0].path); 
        }
        if (req.files.document) {
            deleteImage(req.files.document[0].path); ; 
        }
        return res.status(400).json({ error: "Username already exists" });
      }
    }
    const existingEmail = await AgentPersonalDetails.findOne({ email });
    if (existingEmail ) {
      if (existingEmail.agent_id !== agent_id) {
        if (req.files.logo) {
            deleteImage(req.files.logo[0].path); 
        }
        if (req.files.document) {
            deleteImage(req.files.document[0].path); ; 
        }
        return res.status(400).json({ error: "Email ID already exists" });
      }
    }
    const existingPhone = await AgentPersonalDetails.findOne({ phone_number });
    if (existingPhone ) {
      if (existingPhone.agent_id !== agent_id) {
        if (req.files.logo) {
            deleteImage(req.files.logo[0].path); 
        }
        if (req.files.document) {
            deleteImage(req.files.document[0].path); ; 
        }
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }
    next();
};