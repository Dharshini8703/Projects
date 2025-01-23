import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fsPromises } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* To store  property owners profile */
const profileStorage   = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadPath = path.join(__dirname , ".." , "..", "uploads", "propertyOwnerImages");
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        callback(null, (`${Date.now()}-${file.originalname}`))
    }
})
const uploadProfile  = multer({ storage: profileStorage  });

//for delete image if not registered successfully
const deleteImage = async (filePath) => {
  try {
    await fsPromises.unlink(filePath);
    console.log(`File ${filePath} has been deleted.`);
  } catch (err) {
    console.error(err);
  }
};


export { uploadProfile, deleteImage }; 
