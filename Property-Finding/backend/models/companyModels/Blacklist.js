import mongoose from 'mongoose';

const BlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Blacklist = mongoose.model('CompanyBlacklist', BlacklistSchema);

export default Blacklist;
