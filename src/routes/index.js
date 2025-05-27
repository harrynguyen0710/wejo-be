const express = require("express");
const router = express.Router();

const gameRoutes = require("./games");
const playpalsRoutes = require("./playpals");
const gameChatRoutes = require("./chat/gameChat.route");
const friendChatRoutes = require("./chat/friendChat.route");
const userRoutes = require("./users")

router.use("/games", gameRoutes);
router.use("/friends", playpalsRoutes);
router.use("/game-chats", gameChatRoutes);
router.use("/friend-chats", friendChatRoutes);
router.use("/users", userRoutes);

module.exports = router;
