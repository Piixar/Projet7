const express = require('express');
const router = express.Router();
const messagesCtrl = require('../controllers/messages');

router.post('/new', messagesCtrl.createMessage);
router.get('/list', messagesCtrl.listMessages);
router.put("/:id", messagesCtrl.updateMessage);
router.delete("/:id", messagesCtrl.deleteMessage);

module.exports = router;