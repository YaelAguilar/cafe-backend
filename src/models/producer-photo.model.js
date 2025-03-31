const { DataTypes } = require("sequelize")
const sequelize = require("../config/database.config")

const ProducerPhoto = sequelize.define(
  "ProducerPhoto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_photo",
    },
    producerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_producer",
      references: {
        model: "producers",
        key: "id_producer",
      },
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "image_url",
    },
    publicId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "public_id",
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "upload_date",
    },
  },
  {
    tableName: "producer_photos",
    timestamps: false,
  },
)

module.exports = ProducerPhoto