const { sequelize, Producer, ProducerPhoto, Merchant, MerchantSupplyNeeds } = require("./index")

const syncModels = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await Producer.sync()
    await ProducerPhoto.sync()
    await Merchant.sync()
    await MerchantSupplyNeeds.sync()

    console.log("Models synchronized successfully")
  } catch (error) {
    console.error("Error syncing models:", error)
  }
}

module.exports = syncModels