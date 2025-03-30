const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Asegurarse de que la carpeta de uploads exista
const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuración de multer para almacenar archivos temporalmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

// Rutas públicas
router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)

// Rutas protegidas
router.get("/profile", authMiddleware, userController.getProfile)
router.put("/profile", authMiddleware, userController.updateProfile)
router.post("/logout", authMiddleware, userController.logoutUser)
router.get("/list", authMiddleware, userController.listUsers)

// Rutas para comerciantes
router.get("/merchant/profile", authMiddleware, userController.getMerchantProfile)
router.put("/merchant/profile", authMiddleware, userController.updateMerchantProfile)
router.put("/merchant/supply-needs", authMiddleware, userController.updateMerchantSupplyNeeds)

// Rutas para productores
router.get("/producer/profile", authMiddleware, userController.getProducerProfile)
router.put("/producer/profile", authMiddleware, userController.updateProducerProfile)

// Ruta para subir imagen de perfil
router.post("/upload-profile-image", authMiddleware, upload.single("image"), userController.uploadProfileImage)

// Rutas para fotos de productor
router.post("/producer/upload-photos", authMiddleware, upload.array("photos", 10), userController.uploadProducerPhotos)
router.get("/producer/photos", authMiddleware, userController.getProducerPhotos)

module.exports = router

