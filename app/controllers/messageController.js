const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');

exports.createMessage = async (req, res) => {
  try {
    const user_id = req.userId;
    let { text, conversation_id, target_user_id } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Falta el campo obligatorio text.'
      });
    }
    
    if (!conversation_id && target_user_id) {
      const userA = Math.min(user_id, target_user_id);
      const userB = Math.max(user_id, target_user_id);
      let conversation = await conversationModel.findByUsers(userA, userB);
      if (!conversation) {
        conversation = await conversationModel.createConversation(userA, userB);
      }
      conversation_id = conversation.id;
    }
    
    if (!conversation_id) {
      return res.status(400).json({
        success: false,
        message: 'Falta conversation_id o target_user_id para identificar la conversación.'
      });
    }
    
    // Verificar que la conversación existe.
    const conversation = await conversationModel.findById(conversation_id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'La conversación no existe.'
      });
    }
    
    const newMessage = await messageModel.createMessage(text, user_id, conversation_id);
    
    return res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente.',
      data: newMessage
    });
  } catch (error) {
    console.error('Error en createMessage:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al enviar mensaje.'
    });
  }
};

exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const conversation = await conversationModel.findById(conversation_id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'La conversación no existe.'
      });
    }
    const messages = await messageModel.findByConversation(conversation_id);
    return res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error en getMessagesByConversation:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener mensajes.'
    });
  }
};
