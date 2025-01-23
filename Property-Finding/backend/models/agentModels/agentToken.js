import mongoose from 'mongoose';

const AgentTokenSchema = new mongoose.Schema({
  agent_id: {
    type:String,
    required: true,
    primaryKey: true,
  },
  token: {
    type:String,
    required: true,
  },
});

const AgentToken = mongoose.model('agentToken', AgentTokenSchema);
export default AgentToken; 