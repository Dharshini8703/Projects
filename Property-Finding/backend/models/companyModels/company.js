import mongoose, { now } from 'mongoose';

const companySchema = new mongoose.Schema({
    cmp_id: {
        type: String,
        primaryKey: true,
        unique:true       
    },
    cmp_name: {
        type:String,
        required: true,
        unique:true
    },
    description: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    image_name: {
        type: String,
        required: true
    },
    image_path: {
        type: String,
        required: true
    },
    proof_id: {
        type: String
    },
    proofImage_name: {
        type: String
    },
    proofImage_path: {
        type: String
    },
    property_count: {
        type: Number
    },
    for_rent: {
        type: Number
    },
    for_sale: {
        type: Number
    },
    superAgent_count: {
        type: Number
    },
    agent_count: {
        type: Number
    },
    cmp_verified: {
        type: Boolean,
        default: false
    }
} 
);

const Company = mongoose.model('Company_details', companySchema);
export default Company;