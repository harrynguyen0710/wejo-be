const { PrismaClient } = require("./generated/prisma/client.js");
const prisma = new PrismaClient();

const getAvatarInfoFromGame = async (gameId) => {
    try {
      const participants = await prisma.gameParticipant.findMany({
        where: { gameId },
        include: {
          user: {
            select: {
              Avatar: true,
            },
          },
        },
      });
  
      // Map through participants to extract user Avatar
      const avatars = participants.map(p => p.user?.Avatar).filter(a => a !== undefined);
  
      return avatars; // return array of avatars

    } catch (error) {
      console.error("Lỗi khi lấy thông tin avatar:", error);
      throw error;
    }
  };
  
const getParticipantInfo = async (gameId) => {
  try {
    const participants = await prisma.gameParticipant.findMany({
      where: { gameId },
      include: {
        user: {
          select: {
            id: true,
            Avatar: true,
          },
        },
      },
    });

    // Extracting user ids from the participants
    const userIds = participants.map(p => p.user?.id).filter(id => id !== undefined);
    
    return userIds.length > 0 ? userIds : null; // If no participants, return null
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người tham gia:", error);
    throw error;
  }
};

const getHostIdByGameId = async (gameId) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: {
        CreatedBy: true,
      }
      
    });

    return game;
    
  } catch (error) {
    console.error("Lỗi khi lấy thông tin host:", error);
    throw error;
  }
};  


module.exports = {
  getParticipantInfo,
  getAvatarInfoFromGame,
  getHostIdByGameId,
};
