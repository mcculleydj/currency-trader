const { func } = require('joi')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  'postgres://api:api@localhost:5432/currency_trader'
)

async function sync() {
  return await sequelize.sync()
}

module.exports = sequelize
