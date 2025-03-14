require('dotenv').config();
const app = require('./app/app');
const sequelize = require('./app/database');

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });