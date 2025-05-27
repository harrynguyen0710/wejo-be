const WebSocket = require('ws'); 

const FriendChat = require('../../models/friendChat.model');
const FriendMessage = require('../../models/friendMessage.model');
const { validateUser, validateFriendChat } = require('../middleware/validateChat');

const { getUserById } = require("../../repositories/user.repository.js");


module.exports = (ws, wss) => {
  return {
    async joinFriendChat(data) {
      if (!(await validateUser(ws, data))) return;
      if (!(await validateFriendChat(ws, data))) return;

      ws.chatId = data.chatId; // Store chatId for broadcasting
      console.log(`User ${data.senderId} joined friend:${data.chatId}`);
    },

    async sendFriendMessage(data) {
      if (!(await validateUser(ws, data))) return;
      if (!(await validateFriendChat(ws, data))) return;

      try {
        if (!data.content) {
          ws.send(JSON.stringify({ event: 'error', data: 'Message content is required' }));
          return;
        }
        const message = await FriendMessage.create({
          chatId: data.chatId,
          senderId: data.senderId,
          content: data.content,
          createdAt: new Date(),
          isRead: false
        });

        const user = await getUserById(data.senderId);

        if (!user) {
          console.log("User not found");
          ws.send(JSON.stringify({ event: "error", data: "User not found" }));
          return;
        }

        const fullMessage = {
          id: message.id,   
          senderId: data.senderId,
          chatId: data.chatId,
          content: data.content,
          createdAt: message.createdAt,
          avatar: user?.Avatar || null,
          firstName: user?.FirstName || '',
          lastName: user?.LastName || '',
        }

        console.log('Full Message::', fullMessage);

        const messageData = { event: 'receiveFriendMessage', data: fullMessage };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client.chatId === data.chatId) {
            client.send(JSON.stringify(messageData));
          }
        });
        console.log(`Message sent to friend:${data.chatId}`);
      } catch (error) {
        console.error('Error sending friend message:', error);
        ws.send(JSON.stringify({ event: 'error', data: 'Failed to send message' }));
      }
    }
  };
};