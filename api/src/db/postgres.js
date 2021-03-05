const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  'postgres://api:api@localhost:5432/currency_trader'
)

module.exports = sequelize
