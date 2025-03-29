require('dotenv').config();
const app = require('./app/app');
const sequelize = require('./app/database/db');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.io
const io = socketIo(server, {
  cors: {
    origin: '*', // En producción, limitar a tu dominio
    methods: ['GET', 'POST']
  }
});

// Importar el gestor de sockets
const socketManager = require('./app/sockets/socketManager');

// Inicializar sockets
socketManager(io);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synced successfully.');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });