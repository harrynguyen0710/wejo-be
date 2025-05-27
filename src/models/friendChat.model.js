const mongoose = require('mongoose');

const friendChatSchema = new mongoose.Schema({
    participants: [{ type: String, required: true }],
    createdAt: {
        type: Date, default: Date.now
    }
});

friendChatSchema.index(
  { 'participants.0': 1, 'participants.1': 1 },
  { unique: true }
);

module.exports = mongoose.model('FriendChat', friendChatSchema);