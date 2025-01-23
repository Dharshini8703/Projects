import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { generatePropertyID } from "./helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  

// Function to create a dynamic folder if it doesn't exist 
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const deleteFolder = (folderPath) => {
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`Folder ${folderPath} deleted successfully`);
    } 
  } catch (err) {
    console.error(`Error deleting folder ${folderPath}:`, err);
  }
};

// Define file type checking function
const checkFileType = (file, cb) => {
  if (file.fieldname === "images") {
    (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif')
    ? cb(null,true)
    : cb(null,false); 
  } 
  else if(file.fieldname === "document") {
    (file.mimetype === 'application/msword' || file.mimetype === 'application/pdf')
    ? cb(null,true)
    : cb(null,false);
  }
  else if(file.fieldname === "video") {
    (file.mimetype === 'video/mp4' )
    ? cb(null,true)
    : cb(null,false);
  }
};

/* To store property images & document */
const propertyImagesStorage  = multer.diskStorage({
  destination: async (req, file, cb) => {
    /* To create a folder name same as propertyID & store property images, document */
    let propertyId;
    if(!req.propertyId) {
      propertyId = await generatePropertyID(req);
    } else {
      propertyId = req.propertyId;
    } 
    // const propertyId = req.propertyId;
    // req.propertyId = propertyId;
    const uploadPath = path.join(__dirname,"..","..","uploads","propertyImages",propertyId);
    createFolder(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  
    // cb(null, Date.now() + "-" + file.originalname + "-" + path.extname(file.originalname));
  },
});

const uploadPropertyImages = multer({ 
  storage: propertyImagesStorage, 
  fileFilter: (req, file, cb) => {
  checkFileType(file, cb);
  } 
}).fields([{name: 'images', maxCount: 20}, {name: 'document', maxCount: 1},  {name: 'video', maxCount: 1}]); 

export { uploadPropertyImages, deleteFolder } 