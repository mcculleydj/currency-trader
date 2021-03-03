const { DataTypes } = require('sequelize')

const psql = require('../db/postgres')
const { currencies } = require('../util/constants')

module.exports = psql.define(
  'OpenTrade',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(['p2p', 'open']),
    },
    offerCurrency: {
      type: DataTypes.ENUM(currencies),
      allowNull: false,
    },
    offerAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    requestedCurrency: {
      type: DataTypes.ENUM(currencies),
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
    },
    rate: {
      type: DataTypes.FLOAT,
    },
  },
  { underscored: true }
)
