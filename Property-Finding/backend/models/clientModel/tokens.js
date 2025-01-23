import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  client_id: {
      type: String,
      unique: true,
      required: true
  },
  token: {
      type: String,
      required: true
  },
  type: {
      type: String,
      enum: ['access', 'refresh'],
      required: true
  }  
});

const Tokens = mongoose.model('ClientTokens', TokenSchema);

export default Tokens;