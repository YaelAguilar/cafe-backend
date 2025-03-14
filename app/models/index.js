const sequelize = require('../database/db');

const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');

Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Conversation,
  Message
};
