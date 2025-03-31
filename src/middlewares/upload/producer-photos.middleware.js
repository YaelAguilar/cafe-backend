const { producerPhotosUpload } = require('../../config/multer.config');

/**
 * Middleware para subir fotos de productor
 */
const uploadProducerPhotos = (req, res, next) => {
  producerPhotosUpload.array('photos', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: `Error en la carga: ${err.message}`
      });
    }
    next();
  });
};

module.exports = uploadProducerPhotos;