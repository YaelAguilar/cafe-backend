const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Lote = sequelize.define('Lote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  variedad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cantidad_kg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  precio_por_kg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'reservado', 'vendido'),
    defaultValue: 'disponible'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  proceso: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  altitud: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fotos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  certificaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_cosecha: {
    type: DataTypes.DATE,
    allowNull: true
  },
  atributos_sensoriales: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  productor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'lotes',
  timestamps: true
});

module.exports = Lote;