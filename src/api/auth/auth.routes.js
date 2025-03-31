const express = require("express")
const router = express.Router()
const authController = require("./auth.controller")
const { authMiddleware } = require("./auth.middleware")
const { validateRegisterData, validateLoginData } = require("../../middlewares/validation.middleware")

// Rutas públicas
router.post("/register", validateRegisterData, authController.registerUser)
router.post("/login", validateLoginData, authController.loginUser)

// Rutas protegidas
router.post("/logout", authMiddleware, authController.logoutUser)

module.exports = router