import Admin from "../../models/adminModels/adminModel.js";
import Token from "../../models/adminModels/tokenModel.js"
import Randomstring from "randomstring";
import jwt from "jsonwebtoken";

//for generate access token
const generateAccessToken = (admin) => {
    return jwt.sign(admin, process.env.SECRET_KEY, { expiresIn: '2h' });
};

//for generate refresh token
const generateRefreshToken = async (admin) => {
    const refreshToken = jwt.sign(admin, process.env.REFRESH_SECRET_KEY);
    await Token.create({ admin_id: admin.admin_id, token: refreshToken, type: 'refresh' });
    return refreshToken;
};

//generate random four digit otp
const generateOtp = () => {
    return Randomstring.generate({ length: 4, charset: 'numeric'});
}


//generating random id for admin
const adminIdGenerate = async (req, res) => {
    try {
        const admins = await Admin.find({}).select('admin_id'); // Fetch all admin_id fields

        if (admins.length === 0) {
            return "ADM1001";
        } else {
            const lastAdmin = admins[admins.length - 1].admin_id;
            const adminNumeric = parseInt(lastAdmin.replace("ADM", ""), 10);
            return "ADM" + (adminNumeric + 1);
        }
    } catch (error) {
        console.error("Error generating admin ID:", error);
        res.status(500).json({ error: "Failed to generate admin ID" });
    }
};

export { generateAccessToken, generateRefreshToken, generateOtp, adminIdGenerate};