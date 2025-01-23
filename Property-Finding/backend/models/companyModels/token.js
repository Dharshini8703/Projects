
import mongoose from 'mongoose';

const TokenSchema=new mongoose.Schema({
  cmpUser_id:{
    type: String,
    primaryKey:true,
    required: true,
  },
  token: {
    type:String,
    required: true,
  }
});

const Token = mongoose.model('CompanyToken', TokenSchema);
export default Token;
