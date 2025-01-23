import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { assignClientID, isAuthenticated} from "../../middlewares/clientMiddleware/helper.js";
import { registerValidation, registerValidator, loginValidation, loginValidator, forgotPasswordValidation, forgotPasswordValidator, resetPasswordValidation, resetPasswordValidator, } from "../../middlewares/clientMiddleware/validator.js";
import { createClientController, verifyEmail, clientLogin, forgotPassword, resetPassword, clientLogout, clientDetails} from "../../controllers/clientController/client.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..','..', 'uploads','clientImages');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const clientsRouter = express.Router();

clientsRouter.post("/create",upload.single('profile'),registerValidation,registerValidator,assignClientID,createClientController);
clientsRouter.get("/:id/verify/:token",verifyEmail);
clientsRouter.post("/login",loginValidation,loginValidator,clientLogin);
clientsRouter.post('/forgot-password',forgotPasswordValidation,forgotPasswordValidator,forgotPassword);
clientsRouter.post('/reset-password',resetPasswordValidation,resetPasswordValidator,resetPassword);
clientsRouter.post('/logout',isAuthenticated,clientLogout);
clientsRouter.get('/clientDetails', clientDetails);

// clientsRouter.post('/refresh-token', refreshToken);
// clientsRouter.post('/test',upload.single('profile'),test);
// clientsRouter.post('/test1',test1);
// clientsRouter.get("/test2", test2);
// clientsRouter.post("/test3", upload.single("image"), test3);
// clientsRouter.post('/appointment',clientAppointmentWithAgent);


export default clientsRouter;

































/*

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authMiddleware, authController.logout);

*/