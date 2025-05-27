const GameMessage = require("../models/gameMessage.model");
const { getUserById } = require("../repositories/user.repository");

const fetchGameMessages = async (gameId, { limit, before }) => {
  const query = { gameId };
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const game = await GameMessage.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  const gameMessages = await Promise.all(
    game.map(async (message) => {
      const user = await getUserById(message.senderId); 
      return {
        ...message._doc, 
        avatar: user.Avatar, 
      };
    })
  );


  return gameMessages;
};

const markMessageAsRead = async (gameId, messageId, userId) => {
  const message = await GameMessage.findById(messageId);
  if (!message || message.gameId !== gameId) {
    return { success: false, status: 404, error: "Message not found" };
  }
  if (!message.readBy.includes(String(userId))) {
    message.readBy.push(String(userId));
    await message.save();
  }
  return { success: true };
};

module.exports = {
  fetchGameMessages,
  markMessageAsRead,
};
