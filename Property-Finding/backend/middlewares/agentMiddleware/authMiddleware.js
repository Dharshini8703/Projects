import jwt from 'jsonwebtoken';
import AgentBlacklist from '../../models/agentModels/agentBlacklist.js';
import config from 'config'
const JWT_SECRET = config.get('JWT_SECRET');

const auth = async (req, res, next) => {
  console.log("haio");
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const blacklistedToken = await AgentBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ error: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    // req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' }); 
  }
};

export default auth;