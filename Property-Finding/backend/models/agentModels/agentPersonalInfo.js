import mongoose, { now } from 'mongoose';

// Agent table
const AgentSchema=new mongoose.Schema({
    agent_id:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String, 
        required:true 
    }, 
    email:{
        type:String,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true,
        unique:true
    },
    address: {  
        type: String,
        required:true
    },
    image_name: {  
        type: String
    }, 
    image_path: {
        type: String
    },
    language: {
        type: String
    },
    nationality: {
        type: String
    },
    uploaded_at: {
        type: Date,
        defaultValue: now 
    },
    resetPasswordOtp: {
      type: String,
      default: '', // Default value to prevent undefined
    },
    email_verified: {
        type: Boolean,
        default: false
    }
}
);

const AgentPersonalDetails = mongoose.model('AgentPersonalDetails', AgentSchema);
export default AgentPersonalDetails;
