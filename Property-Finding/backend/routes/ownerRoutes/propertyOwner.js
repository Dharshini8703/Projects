import express from 'express';
import { uploadProfile } from '../../middlewares/propertyOwnerMiddleware/multer.js';

import { signupValidation, signupValidator, loginValidation, loginValidator, forgotPasswordValidation, forgotPasswordValidator, resetPasswordValidation, resetPasswordValidator, updateValidation, updateValidator } from '../../middlewares/propertyOwnerMiddleware/ownerValidator.js';
import { assignPropertyOwnerID, isAuthenticated} from '../../middlewares/propertyOwnerMiddleware/helper.js';
import { createPropertyOwners, forgotPassword, ownerLogin, ownerLogout, resetPassword, verifyEmail, ownerDetails, ownerDetailsEdit, getAllProperties } from '../../controllers/propertyOwnerController/owners.js';

const ownersRouter = express.Router();

ownersRouter.post('/register', uploadProfile.single('profile'), signupValidation, signupValidator, assignPropertyOwnerID,createPropertyOwners);

ownersRouter.post('/login',loginValidation, loginValidator, ownerLogin);

ownersRouter.post('/logout', isAuthenticated, ownerLogout);

ownersRouter.post('/forgot-password',forgotPasswordValidation, forgotPasswordValidator, forgotPassword);

ownersRouter.post('/reset-password',resetPasswordValidation, resetPasswordValidator, resetPassword);

ownersRouter.get("/:id/verify/:token", verifyEmail);
 
ownersRouter.get("/details", ownerDetails);

ownersRouter.patch("/details/update", uploadProfile.single('profile'), updateValidation, updateValidator, ownerDetailsEdit);

ownersRouter.get("/all/properties", getAllProperties); 

export default ownersRouter;

// uploadPropertyImages.array('property-images')
