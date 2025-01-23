import mongoose from 'mongoose';

const AgentBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const AgentBlacklist = mongoose.model('AgentBlacklist', AgentBlacklistSchema);
export default AgentBlacklist;
 