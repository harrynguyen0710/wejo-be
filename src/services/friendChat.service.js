const FriendChat = require("../models/friendChat.model");
const FriendMessage = require("../models/friendMessage.model");

const { getUserById } = require("../repositories/user.repository");

const { PrismaClient } = require("../generated/prisma/client.js");
const prisma = new PrismaClient();

// const friendship = await prisma.userPlaypal.findFirst({
//   where: { UserId1: String(user1), UserId2: String(user2) }
// });
// if (!friendship) {
//   return { success: false, status: 403, error: 'Not friends' };
// }

const createFriendChat = async (userId, friendId) => {
  const friend = await prisma.user.findUnique({ where: { Id: friendId } });
  if (!friend) {
    return { success: false, status: 400, error: "Invalid friend ID" };
  }
  const [user1, user2] = [userId, friendId].sort().map(String);
  if (userId === friendId) {
    return {
      success: false,
      status: 400,
      error: "Cannot start a chat with yourself",
    };
  }

  let chat = await FriendChat.findOne({ participants: [user1, user2] });
  if (!chat) {
    chat = await FriendChat.create({
      participants: [user1, user2],
      createdAt: new Date(),
    });
  }
  return { success: true, chat };
};

const getGameChatIdByUser = async (userId1, userId2) => {
  try {
    const chat = await FriendChat.findOne({
      participants: { $all: [userId1, userId2] },
    });

    if (chat) {
      return chat._id;
    } else {
      return null; // No chat found
    }
  } catch (error) {
    console.error("Error getting chat:", error);
    throw error;
  }
};
const fetchFriendChats = async (userId) => {
  const chats = await FriendChat.find({ participants: String(userId) });

  return await Promise.all(
    chats.map(async (chat) => {
      const lastMessage = await FriendMessage.findOne({
        chatId: chat._id,
      }).sort({ createdAt: -1 });
      return {
        chatId: chat._id,
        participants: chat.participants,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
            }
          : null,
      };
    })
  );
};

const fetchFriendMessages = async (chatId, { limit, before }) => {
  const query = { chatId };
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const messages = await FriendMessage.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  const enrichedMessages = await Promise.all(
    messages.map(async (message) => {
      const user = await getUserById(message.senderId);
      return {
        ...message._doc, // keep all message fields
        avatar: user.Avatar,
        firstName: user.FirstName,
        lastName: user.LastName,
      };
    })
  );

  return enrichedMessages;
};

const markMessageAsRead = async (chatId, messageId) => {
  const message = await FriendMessage.findById(messageId);
  if (!message || message.chatId.toString() !== chatId) {
    return { success: false, status: 404, error: "Message not found" };
  }
  if (!message.isRead) {
    message.isRead = true;
    await message.save();
  }
  return { success: true };
};

module.exports = {
  createFriendChat,
  fetchFriendChats,
  fetchFriendMessages,
  markMessageAsRead,
  getGameChatIdByUser,
};
