const express = require("express")
const router = express.Router()
const producerController = require("./producer.controller")
const { authMiddleware, isProducer } = require("../auth/auth.middleware")
const { uploadProducerPhotos, uploadProfileImage } = require("../../middlewares/upload")

// Rutas protegidas
router.get("/profile", authMiddleware, producerController.getProducerProfile)
router.put("/profile", authMiddleware, producerController.updateProducerProfile)
router.get("/list", authMiddleware, producerController.getProviderList)
router.get("/photos", authMiddleware, producerController.getProducerPhotos)
router.get("/:id", authMiddleware, producerController.getProducerById)

// Rutas para fotos de productor
router.post(
  "/upload-photos", 
  authMiddleware, 
  uploadProducerPhotos, 
  producerController.uploadProducerPhotos
)

// Ruta para subir imagen de perfil
router.post(
  "/upload-profile-image",
  authMiddleware,
  uploadProfileImage,
  producerController.uploadProfileImage
)

module.exports = router