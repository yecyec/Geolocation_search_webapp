const { DataTypes } = require('sequelize');
const db = require('../dbConnection');
const sequelize = db.sequelize;

// Define Geolocation model
const Geolocation = sequelize.define('Geolocation', {
    street: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    county: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(6, 3),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(6, 3),
      allowNull: true,
    },
    time_zone: {
      type: DataTypes.STRING(32),
      allowNull: true,
    }
  }, {
    primaryKey: false,
    tableName: 'geolocation',
    timestamps: false,
  });

module.exports = Geolocation;