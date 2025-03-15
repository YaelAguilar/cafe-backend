const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadImages = require('../middlewares/uploadImages');

router.post('/', authMiddleware, uploadImages, postController.createPost);

router.get('/', authMiddleware, postController.getAllPosts);

router.get('/:id', authMiddleware, postController.getPostById);

router.put('/:id', authMiddleware, postController.updatePost);

router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
