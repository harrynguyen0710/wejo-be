const mongoose = require("mongoose");

const friendMessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FriendChat",
    required: true,
  },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});


friendMessageSchema.index({ chatId: 1, createdAt: -1 });
module.exports = mongoose.model('FriendMessage', friendMessageSchema);