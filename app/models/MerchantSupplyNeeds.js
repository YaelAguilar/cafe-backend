const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const MerchantSupplyNeeds = sequelize.define(
  "MerchantSupplyNeeds",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coffeeTypes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      get() {
        const value = this.getDataValue("coffeeTypes");
        return value ? (typeof value === "string" ? JSON.parse(value) : value) : [];
      },
      set(value) {
        this.setDataValue("coffeeTypes", Array.isArray(value) ? value : []);
      },
    },
    qualities: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      get() {
        const value = this.getDataValue("qualities");
        return value ? (typeof value === "string" ? JSON.parse(value) : value) : [];
      },
      set(value) {
        this.setDataValue("qualities", Array.isArray(value) ? value : []);
      },
    },
    volumeRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    purchaseFrequency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    additionalRequirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = MerchantSupplyNeeds;
