const sequelize = require('../database/db');

const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Lote = require('./Lote');
const Perfil = require('./Perfil');

// Relaciones entre Conversation y Message
Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

// Relaciones entre User y Message
User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

// Relaciones entre User y Lote
User.hasMany(Lote, { foreignKey: 'productor_id', as: 'lotes' });
Lote.belongsTo(User, { foreignKey: 'productor_id', as: 'productor' });

// Relaciones entre User y Perfil
User.hasOne(Perfil, { foreignKey: 'usuario_id', as: 'perfil' });
Perfil.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = {
  sequelize,
  User,
  Conversation,
  Message,
  Lote,
  Perfil
};