const { uploadProfileImage, uploadProducerPhotos } = require('./upload');
const errorHandler = require('./error-handler.middleware');
const { validateRegisterData, validateLoginData } = require('./validation.middleware');

module.exports = {
  uploadProfileImage,
  uploadProducerPhotos,
  errorHandler,
  validateRegisterData,
  validateLoginData
};