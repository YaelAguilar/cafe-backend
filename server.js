require('dotenv').config();
const app = require('./app/app');
const sequelize = require('./app/database/db');
const syncModels = require("./app/models/sync")

const PORT = process.env.PORT || 3000;

syncModels().then(() => {
  console.log("Models synchronized with database")
})

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
