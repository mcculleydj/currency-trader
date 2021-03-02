const { DataTypes } = require('sequelize')

const psql = require('../db/postgres')

module.exports = psql.define(
  'Card',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    ccv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
)
