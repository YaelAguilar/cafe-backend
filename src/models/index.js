const sequelize = require("../config/database.config")
const User = require("./user.model")
const Producer = require("./producer.model")
const Merchant = require("./merchant.model")
const ProducerPhoto = require("./producer-photo.model")
const MerchantSupplyNeeds = require("./merchant-supply-needs.model")

// Definir relaciones
User.hasOne(Producer, { foreignKey: "userId" })
Producer.belongsTo(User, { foreignKey: "userId" })

User.hasOne(Merchant, { foreignKey: "userId" })
Merchant.belongsTo(User, { foreignKey: "userId" })

Producer.hasMany(ProducerPhoto, { foreignKey: "producerId" })
ProducerPhoto.belongsTo(Producer, { foreignKey: "producerId" })

Merchant.hasOne(MerchantSupplyNeeds, { foreignKey: "merchantId", as: "MerchantSupplyNeeds" })
MerchantSupplyNeeds.belongsTo(Merchant, { foreignKey: "merchantId", as: "merchant" })

module.exports = {
  sequelize,
  User,
  Producer,
  Merchant,
  ProducerPhoto,
  MerchantSupplyNeeds
}