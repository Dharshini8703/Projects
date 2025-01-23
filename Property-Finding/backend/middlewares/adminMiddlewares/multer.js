import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fsPromises } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//storage for multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadPath = path.join(__dirname , ".." , "..", "uploads", "adminImages");
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        callback(null, (`${Date.now()}-${file.originalname}`))
    }
})

const upload = multer({ storage });

//for delete image if not registered successfully
const deleteImage = async (filePath) => {
    try {
        await fsPromises.unlink(filePath);
        console.log(`File ${filePath} has been deleted.`);
    } 
    catch (err) {
      console.error(err);
    }
}

export { upload, deleteImage };