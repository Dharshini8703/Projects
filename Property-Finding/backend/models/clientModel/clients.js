import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  client_id: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
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
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  address: {
    type: String,
    required: true,
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

const Clients = mongoose.model("Clients", ClientSchema);

export default Clients;
