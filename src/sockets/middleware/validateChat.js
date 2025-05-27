const { PrismaClient } = require("../../generated/prisma/client");
const prisma = new PrismaClient();
const FriendChat = require("../../models/friendChat.model");

async function validateUser(ws, data) {
  try {
    const { senderId } = data;
    console.log("senderId::", senderId);
    if (!senderId) {
      ws.send(JSON.stringify({ event: "error", data: "User ID is required" }));
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { Id: senderId },
    });
    if (!user) {
      ws.send(JSON.stringify({ event: "error", data: "Invalid user" }));
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating user:", error);
    ws.send(
      JSON.stringify({ event: "error", data: "Failed to validate user" })
    );
    return false;
  }
}

async function validateGameChat(ws, data) {
  try {
    const { senderId, gameId } = data;
    if (!gameId) {
      ws.send(JSON.stringify({ event: "error", data: "Game ID is required" }));
      return false;
    }

    const gameParticipant = await prisma.gameParticipants.findFirst({
      where: {
        UserId: senderId,
        GameId: gameId,
      },
    });
    if (!gameParticipant) {
      ws.send(JSON.stringify({ event: "error", data: "User not in game" }));
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating game chat:", error);
    ws.send(
      JSON.stringify({ event: "error", data: "Failed to validate game chat" })
    );
    return false;
  }
}

async function validateFriendChat(ws, data) {
  try {
    // const { senderId, chatId } = data;
    const { senderId, chatId } = data;
    console.log("Chat Id:", chatId);
    console.log("senderId::", senderId);

    if (!chatId) {
      ws.send(JSON.stringify({ event: "error", data: "Chat ID is required" }));
      return false;
    }

    const chat = await FriendChat.findById(chatId);
    if (!chat || !chat.participants.includes(senderId)) {
      ws.send(
        JSON.stringify({
          event: "error",
          data: "Invalid chat or user not a participant",
        })
      );
      return false;
    }

    const [user1, user2] = chat.participants.map(String).sort();
    const friendship = await prisma.userPlaypal.findFirst({
      where: {
        UserId1: user1,
        UserId2: user2,
      },
    });
    const friendShip2 = await prisma.userPlaypal.findFirst({
      where: {
        UserId1: user2,
        UserId2: user1,
      },
    });
    if (!friendship && !friendShip2) {
      ws.send(
        JSON.stringify({ event: "error", data: "Participants are not friends" })
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating friend chat:", error);
    ws.send(
      JSON.stringify({ event: "error", data: "Failed to validate friend chat" })
    );
    return false;
  }
}

module.exports = {
  validateUser,
  validateGameChat,
  validateFriendChat,
};
