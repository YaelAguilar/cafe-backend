const Message = require('./Message');

const messageModel = {};

messageModel.createMessage = async (text, body, user_id, conversation_id) => {
  return await Message.create({
    text,
    body,
    user_id,
    conversation_id
  });
};

messageModel.findByConversation = async (conversation_id) => {
  return await Message.findAll({
    where: { conversation_id },
    order: [['created_at', 'ASC']]
  });
};

module.exports = messageModel;
