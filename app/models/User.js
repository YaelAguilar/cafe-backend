const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_user",
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM("producer", "merchant"),
      allowNull: false,
      field: "user_type",
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "registration_date",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  },
)

module.exports = User

