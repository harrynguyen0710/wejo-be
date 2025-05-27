const friendChatService = require('../services/friendChat.service');

const startFriendChat = async (req, res) => {
  const { userId, friendId } = req.body;
  console.log("userId::", userId);
  console.log("friendId::", friendId);
  try {
    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }
    const result = await friendChatService.createFriendChat(userId, friendId);
    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }
    res.status(201).json({
      chatId: result.chat._id,
      participants: result.chat.participants,
      createdAt: result.chat.createdAt
    });
  } catch (error) {
    console.error('Error starting friend chat:', error);
    res.status(500).json({ error: 'Failed to start friend chat' });
  }
};

const listFriendChats = async (req, res) => {
  const { userId } = req.query;
  try {
    const chats = await friendChatService.fetchFriendChats(userId);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching friend chats:', error);
    res.status(500).json({ error: 'Failed to fetch friend chats' });
  }
};

const getGameChatId = async (req, res) => {
  const { userId1, userId2 } = req.query;

  try {
    const chatId = await friendChatService.getGameChatIdByUser(userId1, userId2);
    res.json(data =
       {chatId});
  } catch {
    console.error('Error fetching friend chat id:', error);
    res.status(500).json({ error: 'Failed to fetch friend chat id' });  
  }
}

const getFriendMessages = async (req, res) => {
  const { chatId } = req.params;
  const { limit = 50, before } = req.query;
  try {
    const messages = await friendChatService.fetchFriendMessages(chatId, { limit, before });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching friend messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const markMessageAsRead = async (req, res) => {
  const { chatId } = req.params;
  const { userId, messageId } = req.body;
  try {
    if (!messageId) {
      return res.status(400).json({ error: 'Message ID is required' });
    }
    const result = await friendChatService.markMessageAsRead(chatId, messageId);
    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Error marking friend message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

module.exports = {
  startFriendChat,
  listFriendChats,
  getFriendMessages,
  markMessageAsRead,
  getGameChatId,
};