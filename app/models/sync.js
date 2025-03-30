const sequelize = require("../database/db")
const Producer = require("./Producer")
const ProducerPhoto = require("./ProducerPhoto")

const syncModels = async () => {
  try {
    await Producer.sync()

    await ProducerPhoto.sync()

    console.log("Producer Photos table created successfully")
  } catch (error) {
    console.error("Error syncing models:", error)
  }
}

module.exports = syncModels

