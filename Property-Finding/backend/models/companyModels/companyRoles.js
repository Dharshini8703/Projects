import mongoose from 'mongoose';

const companyRolesSchema = new mongoose.Schema({
    cmp_id: {
        type: String,
        required: true     
    },
    user_id: {
        type: String,
        required: true,
        unique:true       
    },
    first_name: {
        type:String,
        required: true
    },
    last_name: {
        type:String,
        required: true
    },
    phone_number: {
        type:String,
        required: true,
        unique:true
    },
    email: {
        type:String,
        required: true,
        unique:true
    },
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    image_name: {
        type: String
    },
    image_path: {
        type: String
    },
    resetPasswordOtp: {
        type: String,
        default: ""
    },
    email_verified: {
        type: Boolean,
        default: false
    }
} 
);

const CompanyRoles = mongoose.model('Company_roles', companyRolesSchema);
export default CompanyRoles;