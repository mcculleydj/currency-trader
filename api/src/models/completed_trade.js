const { DataTypes } = require('sequelize')

const psql = require('../db/postgres')
const { currencies } = require('../util/constants')

module.exports = psql.define(
  'CompletedTrade',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(['p2p', 'open']),
    },
    offerorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offerorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offereeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offereeName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    expirationDate: {
      type: DataTypes.DATE,
    },
    rate: {
      type: DataTypes.FLOAT,
    },
  },
  { underscored: true }
)
