import mongoose from "mongoose";

const PropertyBasicInfoSchema = new mongoose.Schema({
  property_id: {
    type: String,
    unique: true,
    required: true,
  },
  property_type: {
    type: String,
    enum: ["Town House", "Villa", "Apartment"],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  bedroom: {
    type: String,
    required: true,
  },
  bathroom: {
    type: String, 
    required: true,
  },
  square_feet: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  service_type: {
    type: String,
    enum: ["Buy", "Rent", "Commercial Buy", "Commercial Rent"],
    required: true,
  },
  permit_number: {
    type: String,
    required: true,
  },
  property_img_name: {
    type: String,
    required: true,
  }, 
  property_img_path: {
    type: String,
    required: true, 
  },
  property_doc_name: {
    type: String, 
    required: true,
  },
  property_doc_path: {
    type: String,
    required: true,
  },
  property_vdo_name: {
    type: String,
    required: true,
  },
  property_vdo_path: {
    type: String,
    required: true,
  },
  property_verification: {
    type: String,
    enum: ["Verified", "Not Verified"],
    required: true,
  },
  uploadedBy: {
    type: String,
    enum: ["Owner", "Agent", "Company"],
    required: true,
  }
});

const PropertyBasicInfo = mongoose.model("PropertyBasicInfo", PropertyBasicInfoSchema);

export default PropertyBasicInfo;

