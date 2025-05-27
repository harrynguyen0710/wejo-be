const WebSocket = require("ws");
const GameMessage = require("../../models/gameMessage.model.js");
const {
  validateUser,
  validateGameChat,
} = require("../middleware/validateChat");

const { getUserById } = require("../../repositories/user.repository.js");

console.log(GameMessage);

module.exports = (ws, wss) => {
  return {
    async joinGameChat(data) {
      if (!(await validateUser(ws, data))) return;
      if (!(await validateGameChat(ws, data))) return;

      ws.gameId = data.gameId; // Store gameId for broadcasting
      console.log(`User ${data.senderId} joined game:${data.gameId}`);
    },

    async sendGameMessage(data) {
      console.log('Verifying successfully!')
      if (!(await validateUser(ws, data))) return;
      if (!(await validateGameChat(ws, data))) return;
      try {
        if (!data.content) {
          console.log("error here");
          ws.send(
            JSON.stringify({
              event: "error",
              data: "Message content is required",
            })
          );
          return;
        }
        const message = await GameMessage.create({
          gameId: data.gameId,
          senderId: data.senderId,
          content: data.content,
          createdAt: new Date(),
          readBy: [data.senderId],
        });
        console.log("message::", message);
        console.log("data::", data);

        const user = await getUserById(data.senderId);

        if (!user) {
          console.log("User not found");
          ws.send(JSON.stringify({ event: "error", data: "User not found" }));
          return;
        }

        const fullMessage = {
          id: message.id,   // (or whatever GameMessage primary key is)
          senderId: data.senderId,
          gameId: data.gameId,
          content: data.content,
          createdAt: message.createdAt,
          avatar: user?.Avatar || null,
          firstName: user?.FirstName || '',
          lastName: user?.LastName || '',
        };
        
        console.log('fullMesssage::', fullMessage)
        const messageData = { event: 'newMessage', data: fullMessage };

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client.gameId === data.gameId) {
            client.send(JSON.stringify(messageData));
          }
        });

        // wss.clients.forEach((client) => {
        //   if (
        //     client.readyState === WebSocket.OPEN &&
        //     client.gameId === data.gameId
        //   ) {
        //     client.send(JSON.stringify(messageData));
        //   }
        // });
        console.log(`Message sent to game:${data.gameId}`);
      } catch (error) {
        console.error("Error sending game message:", error);
        ws.send(
          JSON.stringify({ event: "error", data: "Failed to send message" })
        );
      }
    },
  };
};
