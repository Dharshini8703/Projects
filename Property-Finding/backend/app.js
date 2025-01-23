import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from "./routes/adminRoutes/authRouter.js"; 
import clientsRouter from './routes/clientRoutes/client.js';
import agentRouter from './routes/agentRoutes/web.js';
import companyRouter from './routes/companyRoutes/auth.js';
import ownersRouter from './routes/ownerRoutes/propertyOwner.js';
import propertyRouter from './routes/propertyRoutes/property.js';

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization','token','x-auth-token', 'password', 'newPassword', 'confirmPassword', 'new-password', 'confirm-password', 'username'],
    credentials: true
  }));

app.use(bodyParser.json()); 
// app.use(express.urlencoded({ extended : true })); 
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser());   
 
app.use('/adminImages', express.static(path.join(__dirname, 'uploads', 'adminImages')));
app.use('/clientImages', express.static(path.join(__dirname, 'uploads', 'clientImages')));
app.use('/agentImages', express.static(path.join(__dirname, 'uploads', 'agentImages')));
app.use('/companyImages', express.static(path.join(__dirname, 'uploads', 'companyImages')));
app.use('/propertyOwnerImages', express.static(path.join(__dirname, 'uploads', 'propertyOwnerImages')));
app.use('/propertyImages', express.static(path.join(__dirname, 'uploads', 'propertyImages')));

app.use('/admin', authRouter);  
app.use('/api/clients', clientsRouter);
app.use('/agent', agentRouter); 
app.use('/api', companyRouter);
app.use('/owners', ownersRouter);
app.use('/property', propertyRouter);

app.listen(port, () => {
    console.log(`server is running on the port ${port}`);
});
