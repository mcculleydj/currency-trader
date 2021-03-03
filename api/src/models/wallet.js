const { DataTypes } = require('sequelize')

const psql = require('../db/postgres')
const { currencies } = require('../util/constants')

const currencyColumns = {}
currencies.forEach(c => {
  currencyColumns[c] = { type: DataTypes.FLOAT, defaultValue: 0 }
})

module.exports = psql.define(
  'Wallet',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ...currencyColumns,
  },
  { underscored: true }
)
