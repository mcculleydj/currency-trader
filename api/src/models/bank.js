const { DataTypes } = require('sequelize')

const psql = require('../db/postgres')

module.exports = psql.define(
  'Bank',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    routingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
)
