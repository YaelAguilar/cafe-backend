const conversationModel = require('../models/conversationModel');

exports.getOrCreateConversationByUsers = async (req, res) => {
  try {
    const currentUser = req.userId;
    const targetUserId = parseInt(req.query.target_id, 10);
    if (!targetUserId) {
      return res.status(400).json({ success: false, message: "Falta target_id." });
    }
    const userA = Math.min(currentUser, targetUserId);
    const userB = Math.max(currentUser, targetUserId);
    let conversation = await conversationModel.findByUsers(userA, userB);
    if (!conversation) {
      conversation = await conversationModel.createConversation(userA, userB);
    }
    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error("Error en getOrCreateConversationByUsers:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor", error: error.message });
  }
};

exports.getConversationById = async (req, res) => {
  try {
    const conversation = await conversationModel.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversación no encontrada." });
    }
    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error("Error en getConversationById:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor", error: error.message });
  }
};
