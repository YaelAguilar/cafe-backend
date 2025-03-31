const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Chat = sequelize.define('chat', {
  id_mensaje: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_remitente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_destinatario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  leido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'chat',
  timestamps: false
});

module.exports = Chat;