const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;