import { body, header, validationResult } from "express-validator";
import { deleteImage } from "./multer.js";
import PropertyOwners from "../../models/propertyOwnerModels/propertyOwners.js";
import jwt from "jsonwebtoken";


export const signupValidation = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must have at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("Username must be within 20 characters"),
  body("first_name")
    .notEmpty()
    .withMessage("First Name is required")
    .isLength({ min: 3 })
    .withMessage("First Name must have at least 3 characters"),
  body("last_name")
    .notEmpty()
    .withMessage("Last Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be 10 digits only"),
  header("password")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters")
    .isLength({ max: 16 })
    .withMessage("Password must be within 16 characters")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/)
    .withMessage("Invalid password"),
];

export const loginValidation = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must have at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("Username must be within 20 characters"),
  header("password")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters")
    .isLength({ max: 16 })
    .withMessage("Password must be within 16 characters")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/)
    .withMessage("Invalid password"),
];

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
];

export const resetPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  header("new-password")
    .isLength({ min: 8 })
    .withMessage("New Password must have at least 8 characters")
    .isLength({ max: 16 })
    .withMessage("New Password must be within 16 characters")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/)
    .withMessage("Invalid password"),
  header("confirm-password")
    .isLength({ min: 8 })
    .withMessage("Confirm Password must have at least 8 characters")
    .isLength({ max: 16 })
    .withMessage("Confirm Password must be within 16 characters")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/)
    .withMessage("Invalid password"),
];

export const updateValidation = [
  body("first_name")
    .optional()
    .notEmpty()
    .withMessage("First Name is required")
    .isLength({ min: 3 })
    .withMessage("First Name must have at least 3 characters"),
  body("last_name")
    .optional()
    .notEmpty()
    .withMessage("Last Name is required"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("phone")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be 10 digits only"),
];

const signupValidator = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file !== undefined) {
      deleteImage(req.file.path);
    }
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: errorMessages[0] });
  }
  const { username, email, phone } = req.body;
  const existingUsername = await PropertyOwners.findOne({ username });
  if (existingUsername) {
    if (req.file !== undefined) {
      deleteImage(req.file.path);
    }
    return res.status(400).json({ error: "Username already exists" });
  }
  const existingEmail = await PropertyOwners.findOne({ email });
  if (existingEmail) {
    if (req.file !== undefined) {
      deleteImage(req.file.path);
    }
    return res.status(400).json({ error: "Email ID already exists" });
  }
  const existingPhone = await PropertyOwners.findOne({ phone });
  if (existingPhone) {
    if (req.file !== undefined) {
      deleteImage(req.file.path);
    }
    return res.status(400).json({ error: "Phone number already exists" });
  }
  next();
};

const loginValidator = async (req, res, next) => {
  const { username } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      const errorMessages = errors.array().map((error) => error.msg);
      console.log(errorMessages[0]);
      return res.status(400).json({ errors: errorMessages[0] });
    }
    const owner = await PropertyOwners.findOne({ username });
    if (!owner) {
      return res.status(400).json({ errors: "Username not exists" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ errors: "Server error" });
  }
};

const forgotPasswordValidator = async (req, res, next) => {
  const { email } = req.body;
  // console.log(email);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      console.log(errorMessages[0]);
      return res.status(400).json({ errors: errorMessages[0] });
    }
    const owner = await PropertyOwners.findOne({ email: email });
    if (!owner) {
      return res.status(400).json({ errors: "Email ID not exists" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ errors: "Server error" });
  }
};

const resetPasswordValidator = async (req, res, next) => {
  const { otp, email } = req.body;
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
    const owner = await PropertyOwners.findOne({ email: email });
    console.log(owner);
    if (!owner) {
      return res.status(400).json({ errors: "Email ID not exists" });
    }
    if (new_password !== confirm_password) {
      return res.status(400).json({ errors: "Password not matched" });
    }
    if (otp !== owner.resetPasswordOTP) {
      return res.status(400).json({ errors: "OTP is invalid" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ errors: "Server error" });
  }
};

const updateValidator = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file !== undefined) {
      deleteImage(req.file.path);
    }
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: errorMessages[0] });
  }
  let profileExists = false;
  if (req.file !== undefined) {
    profileExists = true;
  }
  const token = req.header("x-auth-token");
  console.log(`x-auth-token: ${token}`);
  const { email, phone } = req.body;
  const existingEmail = await PropertyOwners.findOne({ email });
  let decoded;
  if(existingEmail) {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    if (existingEmail.id !== decoded.owner.id) {
      if (req.file !== undefined) {
        deleteImage(req.file.path);
      }
      return res.status(400).json({ error: "Email ID already exists" });
    }
  }
  const existingPhone = await PropertyOwners.findOne({ phone });
  if (existingPhone) {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (existingPhone.id !== decoded.owner.id) {
      console.log(decoded);
      if (req.file !== undefined) {
        deleteImage(req.file.path);
      }
      return res.status(400).json({ error: "Phone number already exists" });
    }
  }
  req.profileExists = profileExists;
  next();
};

export {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateValidator
};
