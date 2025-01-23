import { body,header,validationResult } from 'express-validator';
import { deleteImage } from '../../controllers/companyController/authController.js';
import CompanyRoles from '../../models/companyModels/companyRoles.js';
import Company from '../../models/companyModels/company.js';
import jwt from 'jsonwebtoken';
import  config  from 'config'; 


const JWT_SECRET = config.get('JWT_SECRET');

//Registration validation rules
export const registerValidation = [    
    body('cmp_name').notEmpty().withMessage('Company Name is required'),
    body('first_name').notEmpty().withMessage('First Name is required')
    .isAlpha().withMessage('First Name should be alphabets only'),
    body('last_name').notEmpty().withMessage('Last Name is required')
    .isAlpha().withMessage('Last Name should be alphabets only'),
    body('username').notEmpty().withMessage('User Name is required')
    .isLength({ min: 8}).withMessage('Username must be above 8 characters').isLength({ max: 16}).withMessage('Username must be below 16 characters'),
    header('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8}). withMessage('password must be above 8 characters')
    .isLength({ max: 16}). withMessage('password must be below 16 characters')
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
    .withMessage('Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character'),
    body('address').notEmpty().withMessage('Address is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
    body('phone_number').notEmpty().withMessage('Phone Number is required').matches(/^[0-9]{10}$/).withMessage('contact number must be 10 digits only'), 
  ];

//login validation rules
export const loginValidation=[
    body('username').notEmpty().withMessage('User Name is required')
    .isLength({ min: 8}).withMessage('Username must be above 8 characters')
    .isLength({ max: 16}).withMessage('Username must be below 16 characters'),
    header('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8}). withMessage('password must be above 8 characters')
    .isLength({ max: 16}). withMessage('password must be below 16 characters')
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
    .withMessage('Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character')
]

//forget-password validation rules
export const forgetValidation=[
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
]

//reset-password validation rules
export const resetValidation=[
  body('otp').notEmpty().withMessage('OTP is required')
  .isLength({min:5 ,max:5}).withMessage('Otp must 5 digits only'),
  header('newPassword').notEmpty().withMessage('New Password is required')
  .isLength({ min: 8}). withMessage('password must be above 8 characters')
  .isLength({ max: 16}). withMessage('password must be below 16 characters')
  .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
  .withMessage('Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character'),
  header('confirmPassword').notEmpty().withMessage('Confirm Password is required')
  .isLength({ min: 8}). withMessage('Confirm password must be above 8 characters')
  .isLength({ max: 16}). withMessage('Confirm password must be below 16 characters')
  .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
  .withMessage('Confirm Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character')
]

//company details update validation rules
export const companyUpdateValidation = [
  body('cmp_name').notEmpty().withMessage('Company Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('proof_id').notEmpty().withMessage('Proof ID number is required')
]

//new company user create validation rules
export const newCmpUserValidation = [
  body('role').notEmpty().withMessage('Role is required'),
  body('first_name').notEmpty().withMessage('First Name is required')
  .isAlpha().withMessage('First Name should be alphabets only'),
  body('last_name').notEmpty().withMessage('Last Name is required')
  .isAlpha().withMessage('Last Name should be alphabets only'),
  body('username').notEmpty().withMessage('User Name is required')
  .isLength({ min: 8}).withMessage('Username must be above 8 characters')
  .isLength({ max: 16}).withMessage('Username must be below 16 characters'),
  header('password').notEmpty().withMessage('Password is required')
  .isLength({ min: 8}). withMessage('password must be above 8 characters')
  .isLength({ max: 16}). withMessage('password must be below 16 characters')
  .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
  .withMessage('Password must be between 8 and 16 characters, and include at least one letter, one number, and one special character'),
  body('address').notEmpty().withMessage('Address is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
  body('phone_number').notEmpty().withMessage('Phone Number is required').matches(/^[0-9]{10}$/).withMessage('contact number must be 10 digits only')  
]

//user update valodation rules
export const updateUserValidation = [
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
    const { username, phone_number, email, cmp_name} = req.body;
    const existingUsername = await CompanyRoles.findOne({ username });
    if (existingUsername) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Username already exists" });
    }
    const existingEmail = await CompanyRoles.findOne({ email });
    if (existingEmail ) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Email ID already exists" });
    }
    const existingPhone = await CompanyRoles.findOne({ phone_number });
    if (existingPhone ) {
        if (req.file) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Phone number already exists" });
    }
    const existingCmpName = await Company.findOne({ cmp_name });
    if (existingPhone ) {
        if (existingCmpName) {
            deleteImage(req.file.path); 
        }
        return res.status(400).json({ error: "Company Name already exists" });
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

//company details update validate function
export const validateCompanyUpdate = async (req, res, next) => {
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
  next();
};

//reset validate function
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

//new user create validate function
export const validateNewUserCreate = async (req, res, next) => { 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      deleteImage(req.file.path); 
    }
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ error: errorMessages[0] });
  }
  const { username, phone_number, email} = req.body;
  const existingUsername = await CompanyRoles.findOne({ username });
  if (existingUsername) {
      if (req.file) {
          deleteImage(req.file.path); 
      }
      return res.status(400).json({ error: "Username already exists" });
  }
  const existingEmail = await CompanyRoles.findOne({ email });
  if (existingEmail ) {
      if (req.file) {
          deleteImage(req.file.path); 
      }
      return res.status(400).json({ error: "Email ID already exists" });
  }
  const existingPhone = await CompanyRoles.findOne({ phone_number });
  if (existingPhone ) {
      if (req.file) {
          deleteImage(req.file.path); 
      }
      return res.status(400).json({ error: "Phone number already exists" });
  }
  next();
};

//user update validate function
export const validateUserUpdate = async (req, res, next) => { 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      deleteImage(req.file.path); 
    }
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ error: errorMessages[0] });
  }
  const { username, phone_number, email} = req.body;
  const token = req.header('token');
  let decoded = jwt.verify(token,JWT_SECRET); 
  console.log(decoded);
  if(!decoded){
      return res.json({error: "Invalid token"});
  }
  // const cmp_id = decoded.cmp_id;
  const cmpUser_id = decoded.cmpUser_id;
  console.log(cmpUser_id);
  const existingUsername = await CompanyRoles.findOne({ username });
  console.log(existingUsername);
  if(existingUsername) {
    if (existingUsername.user_id !== cmpUser_id) {
      if (req.file) {
          deleteImage(req.file.path); 
      }
      return res.status(400).json({ error: "Username already exists" });
    }
  }
  const existingEmail = await CompanyRoles.findOne({ email });
  if (existingEmail ) {
    if (existingEmail.user_id !== cmpUser_id) {
      if (req.file) {
        deleteImage(req.file.path); 
      }
      return res.status(400).json({ error: "Email ID already exists" });
    }
  }
  const existingPhone = await CompanyRoles.findOne({ phone_number });
  if (existingPhone ) {
    if (existingPhone.user_id !== cmpUser_id) {
      if (req.file) {
        deleteImage(req.file.path); 
      }
      return res.status(400).json({ error: "Phone number already exists" });
    }
  }
  next();
};
