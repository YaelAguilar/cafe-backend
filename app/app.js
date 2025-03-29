const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const loteRoutes = require('./routes/loteRoutes');
const perfilRoutes = require('./routes/perfilRoutes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/api/perfiles', perfilRoutes);

app.get('/', (req, res) => {
  res.send('CaféConnect API');
});

module.exports = app;