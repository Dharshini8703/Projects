import jwt from "jsonwebtoken";
import PropertyOwners from "../../models/propertyOwnerModels/propertyOwners.js";
import Tokens from "../../models/propertyOwnerModels/tokens.js";
import Blacklist from "../../models/propertyOwnerModels/blacklists.js";

const generateAccessToken = (payload) => {
  console.log(payload);
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 });
};

const generateRefreshToken = async (payload, propertyOwner_id) => {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  await Tokens.create({
    propertyOwner_id: propertyOwner_id,
    token: refreshToken,
    type: "refresh",
  });
  return refreshToken;
};

const assignPropertyOwnerID = async (req, res, next) => {
  try {
    let profileExists = false;
    if (req.file !== undefined) {
      profileExists = true;
    }
    const owners = await PropertyOwners.find({}, "propertyOwner_id").exec();
    let arrID = owners.map((owner) => owner.propertyOwner_id);
    /* If owners & arrID is empty [] which means there is no collection */
    if (arrID.length === 0) {
      /* arrID.length is zero when there is no collection */
      req.propertyOwner_id = "OWN#1001";
      req.profileExists = profileExists;
      console.log(req.propertyOwner_id);
      next();
    } else {
      const lastOwnerID = arrID[arrID.length - 1];
      const arr = lastOwnerID.split("#");
      let newOwnerID = parseInt(arr[1]) + 1;
      req.propertyOwner_id = `OWN#${newOwnerID}`;
      req.profileExists = profileExists;
      next();
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const isAuthenticated = async (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log(`x-auth-token: ${token}`);
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }
  try {
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ error: "Token is blacklisted" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    /*
    {
      owner: { id: '667bd4832b9602893c37f728' },
      iat: 1719391449,
      exp: 1719395049
    }
    */
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export {
  assignPropertyOwnerID,
  isAuthenticated,
  generateAccessToken,
  generateRefreshToken,
  generateOTP
};
