const sequelize = require("../database/db")

const User = require("./User")
const Producer = require("./Producer")
const Merchant = require("./Merchant")
const Conversation = require("./Conversation")
const Message = require("./Message")

User.hasOne(Producer, { foreignKey: "userId" })
Producer.belongsTo(User, { foreignKey: "userId" })

User.hasOne(Merchant, { foreignKey: "userId" })
Merchant.belongsTo(User, { foreignKey: "userId" })

Conversation.hasMany(Message, { foreignKey: "conversationId" })
Message.belongsTo(Conversation, { foreignKey: "conversationId" })

User.hasMany(Message, { foreignKey: "userId" })
Message.belongsTo(User, { foreignKey: "userId" })

module.exports = {
  sequelize,
  User,
  Producer,
  Merchant,
  Conversation,
  Message,
}

