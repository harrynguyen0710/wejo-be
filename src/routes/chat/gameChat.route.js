const express = require('express');
const router = express.Router();

const gameChatController = require('../../controllers/gameChat.controller');


router.get('/:gameId/messages',  gameChatController.getGameMessages);
router.post('/:gameId/messages/mark-read', gameChatController.markMessageAsRead);

module.exports = router;