import { body, check, validationResult } from "express-validator";

export const createPropertyValidation = [
  check("property_type")
    .custom((value) => {
      if (
        value === "Town House" ||
        value === "Villa" ||
        value === "Apartment"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Property type must be either "Town House, Villa or Apartment".'),
  body("location").notEmpty().withMessage("Property location is required"),
  body("bedroom").notEmpty().withMessage("Bedroom is required"),
  body("bathroom").notEmpty().withMessage("Bathroom is required"),
  body("square_feet").notEmpty().withMessage("Square feet is required"), 
  body("title").notEmpty().withMessage("Property title is required"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Property description is required")
    .isLength({ max: 150 })
    .withMessage("Property description must be within 150 characters"),
  body("price").notEmpty().withMessage("Price is required"),
  check("service_type")
    .custom((value) => {
      if (
        value === "Buy" ||
        value === "Rent" ||
        value === "Commercial Buy" ||
        value === "Commercial Rent"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage(
      'service type must be either "Buy, Rent, Commercial Buy or Commercial Rent".'
    ),
  body("permit_number").notEmpty().withMessage("Permit number is required"),
  check("images")
    .custom((value, { req }) => {
    let checkType = true;
    // Check if files are present in the request 
    if (!req.files || !req.files.images || req.files.images.length === 0) {
      throw new Error('No files uploaded');
    }
    // Iterate over the files and check their MIME type
    for (let i = 0; i < req.files.images.length; i++) {
      const mimetype = req.files.images[i].mimetype;
      if (mimetype !== "image/jpeg" && mimetype !== "image/png" && mimetype !== "image/jpg") {
        checkType = false;
        break;
      }
    }
    if (checkType) {
      console.log(checkType); 
      return true;
    } else {
      console.log(checkType);
      return false;
    }
  })
  .withMessage('Property images file type must be either ".jpeg, .jpg, or .png"'),
  check("document")
    .custom((value, { req }) => {
      if (req.files.document[0].mimetype === "application/msword" || req.files.document[0].mimetype === "application/pdf") {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Property document type must be either ".doc, .docx or .pdf"'),
    check("video")
    .custom((value, { req }) => {
      if (req.files.video[0].mimetype === "video/mp4" ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Property video type must be either "mp4"'),
  body("amenities").notEmpty().withMessage("Amenities is required"),
  body("availability").notEmpty().withMessage("Availability of property is required"),
];

const createPropertyValidator = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      // deleteImage(req.file.path);
    }
    console.log(errors);
    // console.log(errors.formatter);
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: errorMessages[0] });
  }
  next();
};

export { createPropertyValidator };
