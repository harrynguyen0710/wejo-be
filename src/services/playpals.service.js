import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PlayPals {
  async createUserPlaypal(req, res) {
    try {
      const { gameId, userId1, userId2 } = req.body;

      if (!gameId || !userId1 || !userId2) {
        return res
          .status(400)
          .json({ message: "gameId, userId1, and userId2 are required." });
      }

      const newUserPlaypal = await prisma.userPlaypal.create({
        data: {
          GameId: gameId,
          UserId1: userId1,
          UserId2: userId2,
          CreatedOn: new Date(),
        },
      });

      return res.status(201).json(newUserPlaypal);
    } catch (error) {
      console.error("Error creating UserPlaypal:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}
