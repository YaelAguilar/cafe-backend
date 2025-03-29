const express = require('express');
const router = express.Router();

const perfilController = require('../controllers/perfilController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadSingleImage = require('../middlewares/uploadSingleImage');

// Obtener perfil propio
router.get('/mi-perfil', authMiddleware, perfilController.getPerfil);

// Obtener perfil de otro usuario
router.get('/:usuario_id', authMiddleware, perfilController.getPerfil);

// Actualizar perfil propio
router.put('/', authMiddleware, uploadSingleImage, perfilController.updatePerfil);

module.exports = router;