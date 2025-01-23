import jwt from 'jsonwebtoken';
import Blacklist from '../../models/companyModels/Blacklist.js';
import  config from 'config';
const JWT_SECRET = config.get('JWT_SECRET');

const auth = async (req, res, next) => {
  
  const token = req.header('x-auth-token');
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  try { 
    const blacklistedToken = await Blacklist.findOne({ token });
    console.log(blacklistedToken);
    if (blacklistedToken) {
      return res.status(401).json({ error: 'Token is blacklisted' });
    } 

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    req.user = decoded.user;
    next(); 
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default auth;
 