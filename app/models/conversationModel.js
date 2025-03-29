const Conversation = require('./Conversation');
const { Op } = require('sequelize');

const conversationModel = {};

conversationModel.createConversation = async (user1_id, user2_id) => {
  return await Conversation.create({ user1_id, user2_id });
};

conversationModel.findByUsers = async (userA, userB) => {
  return await Conversation.findOne({
    where: {
      [Op.or]: [
        { user1_id: userA, user2_id: userB },
        { user1_id: userB, user2_id: userA }
      ]
    }
  });
};

conversationModel.findById = async (id) => {
  return await Conversation.findByPk(id);
};

conversationModel.findByUserId = async (userId) => {
  return await Conversation.findAll({
    where: {
      [Op.or]: [
        { user1_id: userId },
        { user2_id: userId }
      ]
    }
  });
};

module.exports = conversationModel;