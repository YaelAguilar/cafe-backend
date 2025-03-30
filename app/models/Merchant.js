const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const User = require("./User");
const MerchantSupplyNeeds = require("./MerchantSupplyNeeds"); // Importación añadida

const Merchant = sequelize.define(
  "Merchant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_comercializador",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
      references: {
        model: "users",
        key: "id_user",
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "telefono",
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "ciudad",
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "estado",
    },
    businessName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "nombre_negocio",
    },
    businessType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "tipo_negocio",
    },
    yearsInMarket: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "anos_mercado",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "descripcion",
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "sitio_web",
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "imagen_url",
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "fecha_registro",
    },
  },
  {
    tableName: "comercializador",
    timestamps: false,
  }
);

Merchant.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Merchant, { foreignKey: "userId" });

Merchant.hasOne(MerchantSupplyNeeds, { foreignKey: "merchantId", as: "MerchantSupplyNeeds" });
MerchantSupplyNeeds.belongsTo(Merchant, { foreignKey: "merchantId", as: "merchant" });

module.exports = Merchant;
