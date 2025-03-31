const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api');
const errorHandler = require('./middlewares/error-handler.middleware');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas API
app.use('/api', apiRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('API de Café Collect');
});

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;