import express from 'express';
import { uploadPropertyImages } from '../../middlewares/propertyMiddleware/multer.js';
import { createProperty, test1 } from '../../controllers/propertyController/properties.js';
import { generatePropertyID } from '../../middlewares/propertyMiddleware/helper.js'; 
import { createPropertyValidation, createPropertyValidator } from '../../middlewares/propertyMiddleware/propertyValidator.js';

const propertyRouter = express.Router();

// const uploadImages = uploadPropertyImages.fields([{name: 'property-images', maxCount: 20}, {name: 'document', maxCount: 1}]);

propertyRouter.post('/create', uploadPropertyImages, createPropertyValidation, createPropertyValidator,createProperty);

propertyRouter.post('/test1', test1);

export default propertyRouter;
  