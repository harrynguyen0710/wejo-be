const gameChatService = require('../services/gameChat.service');

const getGameMessages = async (req, res) => {
  const { gameId } = req.params;
  const { limit = 50, before } = req.query;
  try {
    const messages = await gameChatService.fetchGameMessages(gameId, { limit, before });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching game messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const markMessageAsRead = async (req, res) => {
  const { gameId } = req.params;
  const { userId, messageId } = req.body;
  try {
    if (!messageId) {
      return res.status(400).json({ error: 'Message ID is required' });
    }
    const result = await gameChatService.markMessageAsRead(gameId, messageId, userId);
    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Error marking game message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

module.exports = {
  getGameMessages,
  markMessageAsRead,
};