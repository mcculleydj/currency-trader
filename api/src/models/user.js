const { DataTypes } = require('sequelize')

const psql = require('../db/postgres')
const { currencies } = require('../util/constants')

module.exports = psql.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    defaultCurrency: {
      type: DataTypes.ENUM(currencies),
      allowNull: false,
    },
  },
  {
    underscored: true,
  }
)
