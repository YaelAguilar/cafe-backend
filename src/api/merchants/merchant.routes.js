const express = require("express")
const router = express.Router()
const merchantController = require("./merchant.controller")
const { authMiddleware, isMerchant } = require("../auth/auth.middleware")
const { uploadProfileImage } = require("../../middlewares/upload")

// Rutas protegidas
router.get("/profile", authMiddleware, merchantController.getMerchantProfile)
router.put("/profile", authMiddleware, merchantController.updateMerchantProfile)
router.put("/supply-needs", authMiddleware, merchantController.updateMerchantSupplyNeeds)
router.get("/list", authMiddleware, merchantController.listMerchants)
router.get("/:id", authMiddleware, merchantController.getMerchantById)

router.post(
  "/upload-profile-image",
  authMiddleware,
  uploadProfileImage,
  merchantController.uploadProfileImage
)

module.exports = router