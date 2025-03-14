const Conversation = require('./Conversation');

const conversationModel = {};

conversationModel.createConversation = async (user1_id, user2_id) => {
  return await Conversation.create({ user1_id, user2_id });
};

conversationModel.findByUsers = async (userA, userB) => {
  return await Conversation.findOne({
    where: {
      user1_id: userA,
      user2_id: userB
    }
  });
};

conversationModel.findById = async (id) => {
  return await Conversation.findByPk(id);
};

module.exports = conversationModel;
