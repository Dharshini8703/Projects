import { body, header, validationResult} from 'express-validator';
import { deleteImage } from './multer.js';
import Admin from '../../models/adminModels/adminModel.js';

const registerValidation = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('phone_number').notEmpty().withMessage('Phone number cannot be empty').matches(/^[0-9]{10}$/).withMessage('Invalid phone number'),
    body('email').notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Invalid email address'),
    body('username').notEmpty().withMessage('Username cannot be empty').isLength({ min: 8, max: 16 }).withMessage('Username must be between 8 and 16 characters'),
    header('password').notEmpty().withMessage('Password cannot be empty').isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,16}$/)
      .withMessage('Password must include at least one uppercase, one lowercase, one number and one special character')
]

const loginValidation = [
    body('username').notEmpty().withMessage('Username cannot be empty').isLength({ min: 8, max: 16 }).withMessage('Invalid Username'),
    header('password').notEmpty().withMessage('Password cannot be empty').isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,16}$/)
      .withMessage('Invalid Password')
]

const forgotPasswordValidation = [
    body('email').notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Invalid email address'),
]

const resetPasswordValidation = [
    body('otp').notEmpty().withMessage('OTP cannot be empty').matches(/^[0-9]{4}$/).withMessage('Invalid OTP. Enter 4 digit OTP.'),
    header('newPassword').notEmpty().withMessage('New Password cannot be empty').isLength({ min: 8, max: 16 }).withMessage('New Password must be between 8 and 16 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,16}$/)
        .withMessage('New Password must include at least one uppercase, one lowercase, one number and one special character'),
    header('confirmPassword').notEmpty().withMessage('Confirm Password cannot be empty').isLength({ min: 8, max: 16 }).withMessage('Confirm Password must be between 8 and 16 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,16}$/)
    .withMessage('Confirm Password must include at least one uppercase, one lowercase, one number and one special character')
]
 
const registerValidateFunc = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ error: errorMessages[0] });
    }
    const { username, phone_number, email} = req.body;
    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Username already exists" });
    }
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail ) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Email ID already exists" });
    }
    const existingPhone = await Admin.findOne({ phone_number });
    if (existingPhone ) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Phone number already exists" });
    }
    next();
};

const loginValidateFunc = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ error: errorMessages[0] });
    }
    next();
};

const forgotPasswordValidateFunc = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ error: errorMessages[0] });
    }
    next();
};

const resetPasswordValidateFunc = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ error: errorMessages[0] });
    }
    const newPassword = req.header('newPassword');
    const confirmPassword = req.header('confirmPassword');
    if (!req.cookies || !req.cookies.email) {
        return res.status(400).json({ error: 'Admin cookie not found' });
    }
    if ( newPassword !== confirmPassword ) {
        return res.status(400).json({ error: "New password and Confirm password must be same" });
    }
    next();
};



export { registerValidation, registerValidateFunc, loginValidation, loginValidateFunc, forgotPasswordValidation, forgotPasswordValidateFunc, resetPasswordValidation, resetPasswordValidateFunc};