const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comments');


router.post('/new', commentCtrl.createComment);
router.get('/list/comment', commentCtrl.readComment);
router.put("/:id", commentCtrl.updateComment);
router.delete("/:id", commentCtrl.deleteComment);

module.exports = router;