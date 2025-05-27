const { PrismaClient } = require("../generated/prisma/client.js");
const prisma = new PrismaClient();

const { getUserById } = require("../repositories/user.repository.js");

const { v4: uuidv4 } = require("uuid");

class PlayPalsController {
  async createUserPlaypal(req, res) {
    try {
      const { gameId, userId1, userId2 } = req.body;
      console.log("req.body::", req.body);

      if (!gameId || !userId1 || !userId2) {
        return res
          .status(400)
          .json({ message: "gameId, userId1, and userId2 are required." });
      }

      const newUserPlaypal = await prisma.userPlaypal.create({
        data: {
          Id: uuidv4(),
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

  async getPlaypals(req, res) {
    console.log("req.params::", req.params);

    try {
      const { userId } = req.params;

      const playpalLinks = await prisma.UserPlaypal.findMany({
        where: {
          UserId1: userId,
        },
        select: {
          UserId2: true,
        },
      });


      const playpalIds = playpalLinks
        .map((link) => link.UserId2)
        .filter((id) => id);

      const playpals = await prisma.User.findMany({
        // capital U
        where: {
          Id: { in: playpalIds }, // capital I
        },
        select: {
          Id: true, 
          FirstName: true,
          LastName: true,
          Avatar: true
        }
      });

      console.log("Fetched playpals:", playpals);

      return res.status(200).json(playpals); // make sure to send response
    } catch (error) {
      console.error("Error getting user playpals::", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = new PlayPalsController();
