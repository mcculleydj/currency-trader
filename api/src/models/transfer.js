const { DataTypes } = require('sequelize')

const psql = require('../db/postgres')

module.exports = psql.define(
  'Transfer',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // meaningful string to describe the transfer destination
    // e.g. bank name
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { underscored: true }
)
