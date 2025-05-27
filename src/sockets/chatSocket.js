module.exports = (wss) => {
  console.log("hi: Initializing WebSocket handlers");

  wss.on("connection", (ws, req) => {
    console.log("🟢 New WebSocket connection:", req.socket.remoteAddress);

    // Initialize handlers
    let gameChat, friendChat;
    try {
      gameChat = require("./handlers/gameChat")(ws, wss);
      friendChat = require("./handlers/friendChat")(ws, wss);
    } catch (error) {
      console.error("🔴 Error in WebSocket handlers:", error);
      ws.send(
        JSON.stringify({ event: "error", data: "Server error during initialization" })
      );
    }

    ws.on("message", (message) => {
      console.log("📩 Message received:", message.toString());

      let parsed;
      try {
        parsed = JSON.parse(message.toString());
      } catch (err) {
        console.error("🔴 Failed to parse message:", err.message);
        ws.send(
          JSON.stringify({ event: "error", data: "Invalid message format" })
        );
        return;
      }

      const { event, data } = parsed;

      // Route events to handlers
      try {
        switch (event) {
          case "joinGameChat":
            gameChat.joinGameChat(data);
            break;
          case "sendGameMessage":
            gameChat.sendGameMessage(data);
            break;
          case "joinFriendChat":
            friendChat.joinFriendChat(data);
            break;
          case "sendFriendMessage":
            friendChat.sendFriendMessage(data);
            break;
          case "test":
            ws.send(
              JSON.stringify({ event: "testResponse", data: "Server received test" })
            );
            break;
          default:
            ws.send(
              JSON.stringify({ event: "error", data: "Unknown event" })
            );
        }
      } catch (error) {
        console.error(`🔴 Error processing event ${event}:`, error);
        ws.send(
          JSON.stringify({ event: "error", data: "Failed to process event" })
        );
      }
    });

    ws.on("error", (error) => {
      console.error("🔴 WebSocket error:", error.message);
    });

    ws.on("close", (code, reason) => {
      console.log(`🔌 WebSocket disconnected. Code: ${code}, Reason: ${reason}`);
    });
  });
};