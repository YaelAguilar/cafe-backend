const { DataTypes } = require("sequelize")
const sequelize = require("../config/database.config")

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
    // Campos adicionales para el perfil completo
    producerType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "individual",
      field: "producer_type",
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "experience_years",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Campos para la pestaña "Datos de la Finca"
    altitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "altitude",
    },
    totalArea: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "total_area",
    },
    coffeeArea: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "coffee_area",
    },
    soilType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "soil_type",
    },
    microclimate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    waterSources: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "water_sources",
      get() {
        const value = this.getDataValue("waterSources")
        return value ? (typeof value === "string" ? JSON.parse(value) : value) : []
      },
      set(value) {
        this.setDataValue("waterSources", Array.isArray(value) ? value : [])
      },
    },
    infrastructure: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Campos para la pestaña "Producción"
    coffeeVarieties: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "coffee_varieties",
      get() {
        const value = this.getDataValue("coffeeVarieties")
        return value ? (typeof value === "string" ? JSON.parse(value) : value) : []
      },
      set(value) {
        this.setDataValue("coffeeVarieties", Array.isArray(value) ? value : [])
      },
    },
    annualProduction: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "annual_production",
    },
    harvestSeason: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "harvest_season",
    },
    processingMethods: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "processing_methods",
      get() {
        const value = this.getDataValue("processingMethods")
        return value ? (typeof value === "string" ? JSON.parse(value) : value) : []
      },
      set(value) {
        this.setDataValue("processingMethods", Array.isArray(value) ? value : [])
      },
    },
    agriculturalPractices: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "agricultural_practices",
    },
    cuppingNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "cupping_notes",
    },
  },
  {
    tableName: "producers",
    timestamps: false,
  },
)

module.exports = Producer