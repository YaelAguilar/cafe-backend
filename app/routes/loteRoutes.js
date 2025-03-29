const express = require('express');
const router = express.Router();

const loteController = require('../controllers/loteController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadImages = require('../middlewares/uploadImages');

// Crear un nuevo lote (solo productores)
router.post('/', authMiddleware, uploadImages, loteController.createLote);

// Obtener todos los lotes
router.get('/', authMiddleware, loteController.getAllLotes);

// Buscar lotes por criterios
router.get('/search', authMiddleware, loteController.searchLotes);

// Obtener lotes de un productor específico
router.get('/productor/:productorId', authMiddleware, loteController.getLotesByProductor);

// Obtener lotes del productor actual
router.get('/mis-lotes', authMiddleware, loteController.getLotesByProductor);

// Obtener un lote específico
router.get('/:id', authMiddleware, loteController.getLoteById);

// Actualizar un lote (solo el dueño)
router.put('/:id', authMiddleware, uploadImages, loteController.updateLote);

// Eliminar un lote (solo el dueño)
router.delete('/:id', authMiddleware, loteController.deleteLote);

module.exports = router;