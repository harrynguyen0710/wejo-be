const express = require("express");
const router = express.Router();
const gameController = require("../../controllers/games.controller");

router.post("/", gameController.getAllGames);

router.get("/:id", gameController.getGameById);

router.get("/host/:id", gameController.getHostInforByGameId);

router.get("/participants/:id", gameController.getParticipantInfo);

router.get("/requests/:id", gameController.getGameRequests);

router.get("/:id/status/:userId", gameController.getGameRequestStatus);

router.patch("/requests/:id/accept", gameController.acceptGameRequest);

router.patch("/requests/:id", gameController.removeGameRequest);

module.exports = router;
