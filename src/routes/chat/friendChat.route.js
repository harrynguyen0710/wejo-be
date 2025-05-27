const express = require('express');
const router = express.Router();
const friendChatController = require('../../controllers/friendChat.controller');

router.post('/create', friendChatController.startFriendChat);
router.get('/', friendChatController.listFriendChats);
router.get('/:chatId/messages', friendChatController.getFriendMessages);
router.post('/:chatId/messages/mark-read', friendChatController.markMessageAsRead);

router.get('/get-chat-id/', friendChatController.getGameChatId);

module.exports = router;