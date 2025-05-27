const { Client } = require("pg");

const { FETCH_GAMES_QUERY } = require("../constants/queries/gameQuery.js");

const { PrismaClient } = require("../generated/prisma/client.js");
const prisma = new PrismaClient();

const { getUserById } = require("../repositories/user.repository.js");

class GameService {
  // get all games
  async getAllGames(data) {
    const client = new Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT || 5432,
    });

    await client.connect();

    const {
      sportId,
      skillStart,
      skillEnd,
      latitude,
      longitude,
      pageNumber = 1,
      pageSize = 10,
    } = data;

    const offset = (pageNumber - 1) * pageSize;
    try {
      const res = await client.query(FETCH_GAMES_QUERY, [
        longitude, // $1
        latitude, // $2
        sportId, // $3
        skillStart, // $4
        skillEnd, // $5
        pageSize, // $6
        offset, // $7
      ]);
      // distance mapping
      const games = res.rows.map((game) => {
        const distanceMeters = parseFloat(game.Distance);
        const distanceKm = distanceMeters / 1000;

        return {
          ...game,
          DistanceInMeters: distanceMeters,
          DistanceInKm: parseFloat(distanceKm.toFixed(2)),
        };
      });
      console.log("Games::", games);
      await client.end();
      return games;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw new Error("Error fetching games: " + error.message);
    }
  }

  async getGameById(id) {
  
    const game = await prisma.game.findUnique({
      where: { Id: id },
      include: {
        GameParticipants: true
      }
    });
  
    const approvedParticipantsCount = await prisma.gameParticipants.count({
      where: {
        GameId: id,
        Status: 2,
      },
    });
  
    const host = await getUserById(game.CreatedBy);
  
    return {
      ...game,
      approvedParticipantsCount,
      host,
    };
  }
  
  async getGameRequests(gameId) {
    const gameInfo = await prisma.game.findUnique({
      where: { Id: gameId },
      include: {
        GameParticipants: {
          include: {
            User: {
              select: {
                Id: true,
                Avatar: true,
                FirstName: true,
                LastName: true,
              },
            },
          },
        },
      },
    });


    const requests = gameInfo.GameParticipants.filter(
      (p) => p.Status === 1
    ).map((p) => ({
      Id: p.User.Id,
      Avatar: p.User.Avatar,
      FirstName: p.User.FirstName,
      LastName: p.User.LastName,
    }));

    return requests;
  }

  async getPariticipantInfo(gameId) {
    const gameInfo = await prisma.game.findUnique({
      where: { Id: gameId },
      include: {
        GameParticipants: {
          include: {
            User: {
              select: {
                Id: true,
                Avatar: true,
                FirstName: true,
                LastName: true,
              },
            },
          },
        },
      },
    });

    const participants = gameInfo.GameParticipants.filter(
      (p) => p.Status === 2
    ).map((p) => ({
      Id: p.User.Id,
      Avatar: p.User.Avatar,
      FirstName: p.User.FirstName,
      LastName: p.User.LastName,
    }));

    console.log("Participants:", participants); // Debugging line

    return participants;
  }

  async getHostInforByGameId(gameId) {
    const game = await prisma.gameParticipants.findUnique({
      where: { Id: gameId },
      include: {
        user: {
          select: {
            Id: true,
            Avatar: true,
          },
        },
      },
    });

    if (game) {
      return game.user;
    } else {
      return null; // or handle the case when the game is not found
    }
  }

  async getGameRequestStatus(userId, gameId) {
    const gameParticipant = await prisma.gameParticipants.findFirst({
      where: {
        UserId: userId,
        GameId: gameId,
      },
    });

    if (!gameParticipant) {
      return null; // Return null if the game participant is not found
    }
    return gameParticipant.Status;
  }

  async acceptGameRequest(userId, gameId) {
    const gameParticipant = await prisma.gameParticipants.findFirst({
      where: {
        UserId: userId,
        GameId: gameId,
      },
    });

    if (!gameParticipant) {
      return null;
    }

    const updatedGameParticipant = await prisma.gameParticipants.update({
      where: {
        Id: gameParticipant.Id,
      },
      data: {
        Status: 2,
      },
    });

    console.log("Updated game participant:", updatedGameParticipant);
    return updatedGameParticipant;
  }

  async removeGameRequest(userId, gameId) {
    const gameParticipant = await prisma.gameParticipants.findFirst({
      where: {
        UserId: userId,
        GameId: gameId,
      },
    });

    if (!gameParticipant) {
      return null;
    }
  
    const updatedGameParticipant = await prisma.gameParticipants.update({
      where: {
        Id: gameParticipant.Id,
      },
      data: {
        Status: 5,
      },
    });

    console.log("Delete game participant:", updatedGameParticipant);
    return updatedGameParticipant;
  }
}

module.exports = new GameService();
