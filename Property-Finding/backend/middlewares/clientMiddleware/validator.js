import { body, header, validationResult } from 'express-validator';
import Clients from '../../models/clientModel/clients.js';

export const registerValidation = [
  body("username")
    .isLength({ min: 3})
    .withMessage("Username must have at least 3 characters")
    .isLength({ max: 20})
    .withMessage("Username must be within 20 characters"),
  body("name").notEmpty().withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must have at least 3 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be 10 digits only"),
  body("address").notEmpty().withMessage("Address is required"),
  header('password')
  .isLength({ min: 8 })
  .withMessage("Password must have at least 8 characters")
  .isLength({ max: 16 })
  .withMessage("Password must be within 16 characters")
  .matches(/^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/)
  .withMessage("Invalid password")
];

export const loginValidation = [
  body("username")
    .isLength({ min: 3})
    .withMessage("Username must have at least 3 characters")
    .isLength({ max: 20})
    .withMessage("Username must be within 20 characters"),
  header('password')
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters")
    .isLength({ max: 16 })
    .withMessage("Password must be within 16 characters")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/)
    .withMessage("Invalid password")
];

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
];

export const resetPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  header('new-password')
    .isLength({ min: 8 })
    .withMessage("New Password must have at least 8 characters")
    .isLength({ max: 16 })
    .withMessage("New Password must be within 16 characters")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/)
    .withMessage("Invalid password"),
  header('confirm-password')
    .isLength({ min: 8 })
    .withMessage("Confirm Password must have at least 8 characters")
    .isLength({ max: 16 })
    .withMessage("Confirm Password must be within 16 characters")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/)
    .withMessage("Invalid password")
];

const registerValidator = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('I am called inside registerValidator() middleware');
      // if (req.file) {
      //   deleteImage(req.file.path);
      // }
      console.log(errors);
      const errorMessages = errors.array().map((error) => error.msg);
      // const errorObjects = errors.array().map(error => ({
      //   field: error.path,
      //   message: error.msg
      // }));
      console.log(errorMessages[0]);
      return res.status(400).json({ errors: errorMessages[0] });
    }
    const { username, email, phone } = req.body;
    const existingUsername = await Clients.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ errors: "Username already exists" });
    }

    const existingEmail = await Clients.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ errors: "Email ID already exists" });
    }

    const existingPhone = await Clients.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ errors: "Phone number already exists" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ errors: "Server error"});
  }
};

const loginValidator = async (req,res,next) => {
  const { username } = req.body;
  console.log(username);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('I am called inside loginValidator() middleware');
      console.log(errors);
      const errorMessages = errors.array().map((error) => error.msg);
      console.log(errorMessages[0]);
      return res.status(400).json({ errors: errorMessages[0] });
    }
    const client = await Clients.findOne({ username });
    console.log(client);
    if (!client) {
      return res.status(400).json({ errors: "Username not exists" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ errors: "Server error" });
  }
}

const forgotPasswordValidator = async (req,res,next) => {
  const { email } = req.body;
  console.log(email);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      console.log(errorMessages[0]);
      return res.status(400).json({ errors: errorMessages[0] });
    }
    const client = await Clients.findOne({ email: email });
    if (!client) {
      return res.status(400).json({ errors: "Email ID not exists" });
    }
    console.log(client);
    next();
  } catch (error) {
    return res.status(500).json({ errors: "Server error" });
  }
}

const resetPasswordValidator = async (req,res,next) => {
  const { otp,email } = req.body;
  console.log(email);
  const new_password = req.header("new-password");
  const confirm_password = req.header("confirm-password");
  console.log(`new-password: ${new_password}`);
  console.log(`confirm-password: ${confirm_password}`);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      console.log(errorMessages[0]);
      return res.status(400).json({ errors: errorMessages[0] });
    }
    const client = await Clients.findOne({ email: email });
    console.log(client);
    if (!client) {
      return res.status(400).json({ errors: "Email ID not exists" });
    }
    if (new_password !== confirm_password) {
      return res.status(400).json({ errors: "Password not matched" });
    }
    if (otp !== client.resetPasswordOTP) {
      return res.status(400).json({ errors: "OTP is invalid" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ errors: "Server error" });
  }
}

export { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator };