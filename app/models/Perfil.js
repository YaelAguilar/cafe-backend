const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Perfil = sequelize.define('Perfil', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  foto_perfil: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  redes_sociales: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  certificaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  calificacion_promedio: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'perfiles',
  timestamps: true
});

module.exports = Perfil;