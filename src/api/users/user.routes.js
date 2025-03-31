const express = require("express")
const router = express.Router()
const userController = require("./user.controller")
const { authMiddleware } = require("../auth/auth.middleware")
const { uploadProfileImage } = require("../../middlewares/upload")

// Rutas protegidas
router.get("/profile", authMiddleware, userController.getProfile)
router.put("/profile", authMiddleware, userController.updateProfile)
router.get("/list", authMiddleware, userController.listUsers)

module.exports = router