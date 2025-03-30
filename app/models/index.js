const sequelize = require("../database/db")

const User = require("./User")
const Producer = require("./Producer")
const Merchant = require("./Merchant")

User.hasOne(Producer, { foreignKey: "userId" })
Producer.belongsTo(User, { foreignKey: "userId" })

User.hasOne(Merchant, { foreignKey: "userId" })
Merchant.belongsTo(User, { foreignKey: "userId" })

module.exports = {
  sequelize,
  User,
  Producer,
  Merchant,
}

