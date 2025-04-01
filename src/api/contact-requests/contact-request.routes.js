const express = require("express");
const router = express.Router();
const contactRequestController = require("./contact-request.controller");
const { authMiddleware } = require("../auth/auth.middleware");

// Rutas protegidas
router.post("/", authMiddleware, contactRequestController.createContactRequest);
router.put("/:requestId", authMiddleware, contactRequestController.updateContactRequestStatus);
router.get("/sent", authMiddleware, contactRequestController.getSentRequests);
router.get("/received", authMiddleware, contactRequestController.getReceivedRequests);
router.get("/connections", authMiddleware, contactRequestController.getConnections);
router.get("/check/:targetId", authMiddleware, contactRequestController.checkContactRequestStatus);

module.exports = router;