const sequelize = require('./database.config');
const cloudinary = require('./cloudinary.config');
const multerConfig = require('./multer.config');

module.exports = {
  sequelize,
  cloudinary,
  multerConfig
};