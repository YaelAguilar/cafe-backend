const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")
const uploadProfileImage = require("../middlewares/uploadProfileImage")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)

router.use(authMiddleware)

router.get("/profile", userController.getProfile)
router.put("/profile", userController.updateProfile)
router.get("/list", userController.listUsers)
router.post("/logout", userController.logoutUser)

router.get("/merchant/profile", userController.getMerchantProfile)
router.put("/merchant/profile", userController.updateMerchantProfile)
router.put("/merchant/supply-needs", userController.updateMerchantSupplyNeeds)

router.post("/upload-profile-image", uploadProfileImage, userController.uploadProfileImage)


module.exports = router