const mongoose = require('mongoose');


const gameMessageSchema = new mongoose.Schema({
    gameId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readBy: [{ type: String }]
}, {
    timestamps: false
});

gameMessageSchema.index({ gameId: 1, createdAt: -1 });

module.exports = mongoose.model('GameMessage', gameMessageSchema);