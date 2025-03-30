const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")
const User = require("./User")

const Producer = sequelize.define(
  "Producer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_producer",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_user",
      references: {
        model: "users",
        key: "id_user",
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    coffeeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "coffee_type",
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "registration_date",
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "image_url",
    },
    businessName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "business_name",
    },
  },
  {
    tableName: "producers",
    timestamps: false,
  },
)

Producer.belongsTo(User, { foreignKey: "userId" })
User.hasOne(Producer, { foreignKey: "userId" })

module.exports = Producer

