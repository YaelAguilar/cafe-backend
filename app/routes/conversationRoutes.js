const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/byusers', authMiddleware, conversationController.getOrCreateConversationByUsers);
router.get('/:id', authMiddleware, conversationController.getConversationById);

module.exports = router;
