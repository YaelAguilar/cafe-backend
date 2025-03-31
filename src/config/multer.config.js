const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurarse de que la carpeta de uploads exista
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración base para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtro para validar que solo se suban imágenes
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'), false);
  }
};

// Configuraciones específicas
const profileImageUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter
});

const producerPhotosUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter
});

module.exports = {
  profileImageUpload,
  producerPhotosUpload
};