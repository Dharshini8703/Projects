import mongoose from 'mongoose';

/*
const AgentDetailsSchema=new mongoose.Schema({
    agent_id:{
        type:String,
        required:true,
        unique:true
    },
    company:{
        type:String,  
        required:true 
    },
    position:{
        type:String,
        required:true
    },
    experience:{
        type:Number
    },
    language:{
        type:String
    },
    unsold_propety:{ 
        type:Number
    },
    rental_property:{
        type:Number
    },
    status:{
        type:String
    },
    last_login:{
        type:Date
    },
    total_deals:{
        type:String
    },
    awards:{
        type:String
    },
    course:{
        type:String
    },
    response_time:{
        type:String
    },
    ratings:{
        type:String
    },
}
);

const AgentDetails = mongoose.model('AgentDetails', AgentDetailsSchema);
*/

const OfficialInfoSchema = new mongoose.Schema({
    agent_id:{
        type:String,
        required:true,
        unique:true,
        ref: 'agentpersonaldetails'
    },
    company_name: {
        type:String
    },
    role:{
        type:String
    },
    type: {
        type: String,
        enum: ["Super Agent", "Agent"],
        default: "Agent"
    },
    license_number: {
        type: String
    },
    license_type: {
        type: String,
        enum: ["BNR", "RERA", "Labour Card", "Employment Visa"]
    },
    proof_file_name: {
        type: String
    },
    proof_file_path: {
        type: String
    },
    license_expiry: {
        type: String
    },
    experience:{
        type:Number
    },
    closed_deals: {
        type:Number
    },
    for_sale: {
        type:Number
    },
    for_rent: {
        type:Number
    },
    account_status:{
        type:String,
        enum: ["Active", "Inactive"]
    },
    last_login: {
        type:String,
        default: ""
    },
    ratings:{
        type:String
    },
    admin_verified: {
        type: Boolean,
        default: false
    }
});

const AgentOfficialDetails = mongoose.model('AgentOfficialDetails', OfficialInfoSchema);

export default AgentOfficialDetails; 