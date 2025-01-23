import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { formatDate } from "../../middlewares/propertyMiddleware/helper.js";
import PropertyBasicInfo from "../../models/propertyModels/propertiesBasicInfo.js";
import PropertyFacilities from "../../models/propertyModels/propertyFacilities.js";
import OwnersWithProperty from "../../models/propertyModels/ownersWithProperties.js";
import PropertyOwners from "../../models/propertyOwnerModels/propertyOwners.js";

const createProperty = async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if(!token) {
      return res.status(400).json({error: "No token provided"});
    }
    console.log(req.body)
    let uploadedBy;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    const id = decoded.owner.owner_id;
    const arr = id.split('#');
    if(arr[0] === 'OWN') {
      uploadedBy = 'Owner';
    } else if(arr[0] === 'AGN') {
      uploadedBy = 'Agent';
    } else if (arr[0] === 'CMP') {
      uploadedBy = 'Company';
    }
    const {
      property_type,
      location,
      bedroom,  
      bathroom,
      square_feet,
      title,
      price,
      service_type,
      permit_number,
      amenities,
      availability
    } = req.body;
    const files = { ...req.files };
    const img_file_name = {};
    const img_file_path = {};
    files.images.map((file, index) => {
      img_file_name[`filename${index + 1}`] = file.filename;
      console.log("filename",file.filename)
      img_file_path[`filepath${index + 1}`] = file.path;
      console.log("filepath",file.path)
    });
    const doc_name = files.document[0].filename; 
    console.log("doc_name",doc_name)
    const doc_path = files.document[0].path;
    console.log("doc_path",doc_path)

    let video_file_name = '';
    let video_file_path = '';
    if (files.video) {
      video_file_name = files.video[0].filename;
      video_file_path = files.video[0].path;
    }

    let jsonObject2 = JSON.parse(JSON.stringify(doc_name));
    let jsonObject3 = JSON.parse(JSON.stringify(doc_path));
    let jsonObject = JSON.parse(JSON.stringify(video_file_name));
    let jsonObject1 = JSON.parse(JSON.stringify((video_file_path)));
    // console.log("fuye",jsonObject); 
    const property = new PropertyBasicInfo({
      property_id: req.propertyId,
      property_type,
      location,
      bedroom,
      bathroom,
      square_feet, 
      title,
      price,
      service_type, 
      permit_number,
      property_img_name: JSON.stringify(img_file_name), 
      property_img_path: JSON.stringify(img_file_path),
      property_doc_name: jsonObject2,
      property_doc_path: jsonObject3, 
      property_vdo_name: jsonObject,
      property_vdo_path: jsonObject1, 
      uploadedBy
    }); 
    console.log("property",property)
    /* Since description field is optional as of now */
    if (req.body.description) {
      property.description = req.body.description;
    }
    property.property_verification = "Not Verified"; 
    await property.save();
    // console.log("property -->",property);
    const date = new Date(availability);
    const formattedDate = formatDate(date);
    // console.log('formattedDate -->', formattedDate);
    /* To print date like 18 Jul 2024 */
    const propertyFacility = new PropertyFacilities({
      property_id: property.id,
      amenities,
      availability:formattedDate,
    });
    await propertyFacility.save();
    // console.log("propertyFacility -->",propertyFacility);
    let ownerProperty;
    if (uploadedBy === 'Owner') {
      // console.log('Owner block....');
      let decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log(decoded.owner.id); 
      const owner = await PropertyOwners.findOne({_id: decoded.owner.id});
      if(owner) {
        ownerProperty = new OwnersWithProperty({ownerId: owner.id,propertyId: property.id});
        await ownerProperty.save();
      }
    } else if(uploadedBy === 'Agent') {

    } else if(uploadedBy === 'Company') {
      
    }
    return res.status(200).json({message: "Property Added successfully"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Internal server error"});
  }
};



const getPropertyByID = async (req, res) => {
  const propertyId = req.params.property_id;
  try {
    const property = await PropertyBasicInfo.aggregate([
      { $match: { property_id: propertyId } },
      {
        $lookup: {
          from: "propertyfacilities",
          localField: "property_id", 
          foreignField: "property_id",
          as: "propertyfacilities",
        },
      },
      {
        $project: {
          agent_id: 1,
          first_name: 1,
          last_name: 1,
          email: 1,
          phone_number: 1,
          language: 1,
          nationality: 1,
          image_name: 1,
          image_path: 1,
          address: 1,
          agentofficialdetails: 1,
        },
      },
    ]);
  } catch (error) {}
};

const test1 = async (req, res) => {
  // const propertyId = 'Kyxzbio-CI8912';
  // const property = await PropertyBasicInfo.find({property_id: propertyId});
  // console.log(property.length);
  // return res.status(200).json(property);
  const files = {
    images: [
      {
        fieldname: "images",
        originalname: "property Account Picture01.png",
        encoding: "7bit",
        mimetype: "image/png",
        destination:
          "G:\\Excercises At Trugo\\Property Finder Git\\Property-Finder\\baropertyImages\\Kyxzbio-CI8912",
        filename: "1720607685673-property Account Picture01.png",
        path: "G:\\Excercises At Trugo\\Property Finder Git\\Property-Finder\\backend\\Images\\Kyxzbio-CI8912\\1720607685673-property Account Picture01.png",
        size: 2155,
      },
      {
        fieldname: "images",
        originalname: "property Account Picture02.png",
        encoding: "7bit",
        mimetype: "image/png",
        destination:
          "G:\\Excercises At Trugo\\Property Finder Git\\Property-Finder\\baropertyImages\\Kyxzbio-CI8912",
        filename: "1720607685673-property Account Picture02.png",
        path: "G:\\Excercises At Trugo\\Property Finder Git\\Property-Finder\\backend\\Images\\Kyxzbio-CI8912\\1720607685673-property Account Picture02.png",
        size: 2155,
      },
      {
        fieldname: "images",
        originalname: "property Account Picture03.png",
        encoding: "7bit",
        mimetype: "image/png",
        destination:
          "G:\\Excercises At Trugo\\Property Finder Git\\Property-Finder\\baropertyImages\\Kyxzbio-CI8912",
        filename: "1720607685673-property Account Picture03.png",
        path: "G:\\Excercises At Trugo\\Property Finder Git\\Property-Finder\\backend\\Images\\Kyxzbio-CI8912\\1720607685673-property Account Picture03.png",
        size: 2155,
      },
    ],
    document: [
      {
        fieldname: "images",
        originalname: "property Account Picture03.png",
        encoding: "7bit",
        mimetype: "image/png",
        destination:
          "G:\\Excercises At Trugo\\Property Finder Git\\Property-Finder\\baropertyImages\\Kyxzbio-CI8912",
        filename: "1720607685673-property Account Picture03.png",
        path: "G:\\Excercises At Trugo\\Property Finder Git\\Property-Finder\\backend\\Images\\Kyxzbio-CI8912\\1720607685673-property Account Picture03.png",
        size: 2155,
      },
    ],
  };
  const img_file_name = {};
  const img_file_path = {};
  files.images.map((file, index) => {
    img_file_name[`filename${index}`] = file.filename;
    img_file_path[`filepath${index}`] = file.path;
  });
  const doc_name = files.document[0].filename;
  const doc_path = files.document[0].path;
  return res
    .status(200)
    .json({ img_file_name, img_file_path, doc_name, doc_path });
};


export { createProperty, test1 };
