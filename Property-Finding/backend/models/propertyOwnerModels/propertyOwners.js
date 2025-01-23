import mongoose from "mongoose";

const PropertyOwnersSchema = new mongoose.Schema({
  propertyOwner_id: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  profile: {
    type: String,
    default: "",
    required: false,
  },
  profile_path: {
    type: String,
    default: "",
    required: false,
  },
  last_login: {
    type: Date,
    default: "",
    required: false,
  },
  emailVerification: {
    type: String,
    enum: ["verified", "not verified"],
    required: true,
  },
  emailVerificationToken: {
    type: String,
    default: "",
    required: false,
  },
  resetPasswordOTP: {
    type: String,
    default: "", 
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: false,
  },
  address: {
    type: String,
    default: "",
    required: false,
  },
});

const PropertyOwners = mongoose.model("PropertyOwners", PropertyOwnersSchema);

export default PropertyOwners;

/*
const PropertyOwnersSchema = new mongoose.Schema({
  propertyOwner_id: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  profile_name: {
    type: String,
    required: true,
  },
  profile_path: {
    type: String,
    required: true,
  },
  uploaded_at: {
    type: Date,
    default: Date.now,
    required: false,
  },
  last_login: {
    type: Date,
    default: "",
    required: false,
  },
  resetPasswordOTP: {
    type: String,
    default: "", // Default value to prevent undefined
    required: false,
  },
  accountStatus: {
    type: String,
    enum: ["activated", "hold"],
    required: true,
  },
  verificationToken: {
    type: String,
    default: "",
    required: false,
  },
});

const PropertyOwners = mongoose.model("PropertyOwners", PropertyOwnersSchema);
*/