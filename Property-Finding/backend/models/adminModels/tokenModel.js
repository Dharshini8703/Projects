import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    admin_id: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['access', 'refresh'],
        allowNull: true
    }  
});

const Token = mongoose.model('adminToken', TokenSchema);

export default Token;
