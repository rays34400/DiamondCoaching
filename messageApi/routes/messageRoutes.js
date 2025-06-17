const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send', messageController.sendMessage);
router.get('/conversation/:key1/:key2', messageController.getConversation);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;