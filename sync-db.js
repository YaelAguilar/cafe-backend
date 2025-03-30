const syncModels = require("./app/models/sync")

syncModels()
  .then(() => {
    console.log("Database tables synchronized")
    process.exit(0)
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err)
    process.exit(1)
  })

