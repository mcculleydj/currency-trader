const { DataTypes } = require('sequelize')

const psql = require('../db/postgres')
const { currencies } = require('../util/constants')

module.exports = psql.define(
  'Purchase',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    method: {
      type: DataTypes.ENUM('card', 'bank'),
      allowNull: false,
    },
    methodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // meaningful string to describe the payment method
    // e.g. last four of CC or bank name
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.ENUM([...currencies]),
      allowNull: false,
    },
  },
  { underscored: true }
)
