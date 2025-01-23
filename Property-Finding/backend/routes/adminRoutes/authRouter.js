import express from 'express';
import {adminRegister, adminLoginJwt, logout, forgotPassword, resetPassword, verifyEmail, adminDetails} from '../../controllers/adminController/authController.js';
import isAdminAuthenticated from '../../middlewares/adminMiddlewares/authentication.js';
import { forgotPasswordValidateFunc, forgotPasswordValidation, loginValidateFunc, loginValidation, registerValidateFunc , registerValidation, resetPasswordValidateFunc, resetPasswordValidation } from '../../middlewares/adminMiddlewares/validator.js';
import { upload } from '../../middlewares/adminMiddlewares/multer.js';

const authRouter = express.Router();

//for register new Admin
authRouter.post("/adminRegister", upload.single('image'), registerValidation, registerValidateFunc, adminRegister);

//for login Admin
authRouter.post("/adminLogin", loginValidation, loginValidateFunc,adminLoginJwt);
authRouter.get("/:id/verify/:token", verifyEmail);
//for verify otp and login
// authRouter.post("/verifyLogin", verifyLogin);

//for forgot password
authRouter.post("/forgotPassword", forgotPasswordValidation, forgotPasswordValidateFunc, forgotPassword);
authRouter.post("/resetPassword", resetPasswordValidation, resetPasswordValidateFunc, resetPassword);

//for logout Admin
authRouter.post("/logout", isAdminAuthenticated, logout);

//home of Admin after login
authRouter.get("/adminDetails",adminDetails);

export default authRouter;