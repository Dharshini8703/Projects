import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({ 
    admin_id: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    }, 
    phone_number: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    imagename: {
        type: String,
        required: true
    },
    imagepath: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.length >= 8 && v.length <= 16;
            },
            message: props => `${props.value} is not a valid username (length between 8 and 16 characters)!`
        }
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordOtp: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    } 
});
  
const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
