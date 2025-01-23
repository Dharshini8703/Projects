import express from 'express'
import { login, logout, registerAgent,forgotPassword,resetPassword,getAgentDetails, verifyEmail, deleteImage, updateAgentDetails } from '../../controllers/agentController/agentController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from '../../middlewares/agentMiddleware/authMiddleware.js';
import { forgotValidation, loginValidation, registerValidation, resetValidation, updateAgentValidation, validateAgentUpdate, validateFunc, validateRegister, validateResetPassword } from '../../middlewares/agentMiddleware/validator.js';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

//for create new router
const agentRouter = express.Router();

//multer storage
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads','agentImages');
        cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
        cb(null, `AGENT-${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });
//multer for multiple image upload
const uploadMultiple = upload.fields([{name: 'logo', maxCount: 1}, {name: 'document', maxCount: 1}]) 

//for register
agentRouter.post('/register', upload.single('image'), registerValidation, validateRegister,registerAgent);

//for verify email
agentRouter.get('/verifyEmail/:id/verify/:token',verifyEmail)

//for login
agentRouter.post('/login', loginValidation, validateFunc, login);

//for forgot password
agentRouter.post('/forgot-password', forgotValidation, validateFunc, forgotPassword);

//for reset password
agentRouter.post('/reset-password', resetValidation, validateResetPassword, resetPassword);

//for logout
agentRouter.post('/logout', auth ,logout);

//for update agent
agentRouter.post('/updateAgent', uploadMultiple, updateAgentValidation, validateAgentUpdate, updateAgentDetails);

//for get agent details
agentRouter.get('/getagent',getAgentDetails);

export default agentRouter; 