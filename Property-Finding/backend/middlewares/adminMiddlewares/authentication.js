import jwt from 'jsonwebtoken';
import Blacklist from '../../models/adminModels/blacklistModel.js';
import dotenv from 'dotenv';

dotenv.config();

const isAdminAuthenticated = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(400).json({ error: 'No token, authorization denied' });
    }

    try {
        const blacklistedToken = await Blacklist.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ error: 'Token is blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }   
}

export default isAdminAuthenticated;