const gameService = require("../services/games.service");

class GameController {
  async getAllGames(req, res) {
    try {
      const data = {
        ...req.body,
        pageNumber: parseInt(req.body.pageNumber) || 1,
        pageSize: parseInt(req.body.pageSize) || 10,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
      };

      const games = await gameService.getAllGames(data);
      res.status(200).json({ success: true, data: games });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getGameById(req, res) {
    try {
      const gameId = (req.params.id);
      const game = await gameService.getGameById(gameId);

      if (!game) {
        return res.status(404).json({ success: false, message: "Game not found" });
      }

      res.status(200).json({ success: true, data: game });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHostInforByGameId(req, res) {
    try {
      const gameId = req.params.id;
      const hostInfo = await gameService.getHostInforByGameId(gameId);

      if (!hostInfo) {
        return res.status(404).json({ success: false, message: "Host not found" });
      }

      res.status(200).json({ success: true, data: hostInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getParticipantInfo(req, res) {
    console.log("Participant Info Request Received"); // Debugging line
    try {
      const gameId = req.params.id;
      console.log("Game ID:", gameId); // Debugging line
      const participantInfo = await gameService.getPariticipantInfo(gameId);
      

      if (!participantInfo) {
        return res.status(404).json({ success: false, message: "Participants not found" });
      }

      res.status(200).json({ success: true, data: participantInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getGameRequests(req, res) {
    try {
      const gameId = req.params.id;
      const gameRequests = await gameService.getGameRequests(gameId);

      if (!gameRequests) {
        return res.status(404).json({ success: false, message: "Game requests not found" });
      }

      res.status(200).json({ success: true, data: gameRequests });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getGameRequestStatus(req, res) {
    try {
      const gameId = req.params.id;
      const userId = req.params.userId;

      const gameRequestStatus = await gameService.getGameRequestStatus(userId, gameId);

      res.status(200).json({ success: true, data: gameRequestStatus });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async acceptGameRequest(req, res) {
    try {
      const userId = req.body.userId;
      const gameId = req.params.id;
      
      const gameRequestStatus = await gameService.acceptGameRequest(userId, gameId);

      res.status(200).json({ success: true, message: "Request accepted", data: gameRequestStatus });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async removeGameRequest(req, res) {

    try {
      const userId = req.body.userId;
      const gameId = req.params.id;

      const gameRequestStatus = await gameService.removeGameRequest(userId, gameId);

      res.status(200).json({ success: true, message: "Request removed", data: gameRequestStatus });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

}


module.exports = new GameController();
