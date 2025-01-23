import express from 'express';
import { companyDetailsUpdate, createCompanyUser, forgetpassword, getCmpUserDetails, getCompanyDetails, getSingleUserDetails, getUpdateDetails, login, logout, register, resetpassword, roles, updateSingleUser, verifyEmail } from '../../controllers/companyController/authController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import auth from '../../middlewares/companyMiddleware/authMiddleware.js';
import { loginValidation, forgetValidation, resetValidation, registerValidation, validateRegister, validateFunc, validateResetPassword, companyUpdateValidation, validateCompanyUpdate, newCmpUserValidation, validateNewUserCreate, updateUserValidation, validateUserUpdate } from '../../middlewares/companyMiddleware/express validator.js';
const companyRouter = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'companyImages');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // cb(null, `${Date.now()}-${file.originalname}`);
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
//for multiple image upload
const uploadMultiple = upload.fields([{name: 'logo', maxCount: 1}, {name: 'document', maxCount: 1}])

//register route
companyRouter.post('/register', upload.single('image'), registerValidation, validateRegister, register);

//for login
companyRouter.post('/login', loginValidation, validateFunc, login);

//for forgot password
companyRouter.post('/forgot-password', forgetValidation, validateFunc, forgetpassword);

//for reset password
companyRouter.post('/reset-password', resetValidation, validateResetPassword, resetpassword);

//for logout
companyRouter.post('/logout', auth, logout);

//for update company details
companyRouter.patch('/companyUpdate', uploadMultiple, companyUpdateValidation, validateCompanyUpdate, companyDetailsUpdate);

//for create new user in company
companyRouter.post('/createNewCmpUser', upload.single('image'), newCmpUserValidation, validateNewUserCreate, createCompanyUser);

//for update user in company
companyRouter.post('/updateUser', upload.single('image'), updateUserValidation, validateUserUpdate, updateSingleUser);

//email verifications
companyRouter.get('/company/:id/verify/:token', verifyEmail);

//for get company details with owner details
companyRouter.get('/getCompanyDetails', getCompanyDetails);

//for get only company details
companyRouter.get('/getUpdateDetails', getUpdateDetails);

//for get the list of users under single company
companyRouter.get('/getCmpUserDetails', getCmpUserDetails);

//for get the details of current login user
companyRouter.get('/getSingleUserDetails', getSingleUserDetails);

//for roles
companyRouter.get('/getRoles', roles);


export default companyRouter;  


















