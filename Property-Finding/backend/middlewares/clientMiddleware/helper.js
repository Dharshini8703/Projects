import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Tokens from "../../models/clientModel/tokens.js";
import Clients from "../../models/clientModel/clients.js";
import Blacklist from "../../models/clientModel/blacklist.js";

dotenv.config();


const generateAccessToken = (payload) => {
  console.log(payload);
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 });
};

const generateRefreshToken = async (payload, client_id) => {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  await Tokens.create({
    client_id: client_id,
    token: refreshToken,
    type: "refresh",
  });
  return refreshToken;
};

/* To create unique ID for clients */
const assignClientID = async (req, res, next) => {
  try {
    console.log("Middleware func");
    const clients = await Clients.find({}, "client_id").exec();
    // console.log(clients);
    let arrID = clients.map((client) => client.client_id);
    console.log(arrID);
    /* arrID.length is zero when there is no collection */
    if (arrID.length === 0) {
      req.client_id = "CLI#1001";
      console.log(req.client_id);
      next();
    } else {
      const lastClientID = arrID[arrID.length - 1];
      console.log(`lastClientID:${lastClientID}`);
      const arr = lastClientID.split("#");
      let newClientID = parseInt(arr[1]) + 1;
      req.client_id = `CLI#${newClientID}`;
      console.log(req.client_id);
      next();
    }
  } catch (error) {
    console.log("Error in assignClientID middleware func");
    return res.status(500).json({ error: error.message });
  }
};

const isAuthenticated = async (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log(`x-auth-token: ${token}`);
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ msg: "Token is blacklisted" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // req.user = decoded.user;
    console.log(decoded);
    /*
    {
      client: { id: '667bd4832b9602893c37f728' },
      iat: 1719391449,
      exp: 1719395049
    }
    */
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }

  // const token = req.header("Authorization")?.split(" ")[1];
  // console.log(`req.header('Authorization') contains`);
  // console.log(req.header("Authorization"));
  // if (!token) {
  //   return res.status(401).json({ error: "Access denied, no token provided" });
  // }
  // try {
  //   const decoded = jwt.verify(token, process.env.SECRET_KEY);
  //   // req.user = decoded;
  //   // console.log(decoded);
  //   next();
  // } catch (error) {
  //   res.status(400).json({ error: "Invalid token" });
  // }
};

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
    // console.log(digits[Math.floor(Math.random() * 10)]);
  }
  return OTP;
};

export {
  assignClientID,
  generateAccessToken,
  generateRefreshToken,
  isAuthenticated,
  generateOTP,
};
