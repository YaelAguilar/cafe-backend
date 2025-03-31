require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database.config');
const syncModels = require("./models/sync");

const PORT = process.env.PORT || 3000;

// Sincronizar modelos con la base de datos
syncModels().then(() => {
  console.log("Models synchronized with database");
});

// Conectar a la base de datos y iniciar el servidor
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