const { profileImageUpload } = require('../../config/multer.config');
const fs = require('fs');

/**
 * Middleware para subir imagen de perfil
 */
const uploadProfileImage = (req, res, next) => {
  profileImageUpload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: `Error en la carga: ${err.message}`
      });
    }
    next();
  });
};

module.exports = uploadProfileImage;