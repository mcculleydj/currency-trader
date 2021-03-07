const psql = require('../db/postgres')

const User = require('./user')
const Wallet = require('./wallet')
const Card = require('./card')
const Bank = require('./bank')
const OpenTrade = require('./open_trade')
const CompletedTrade = require('./completed_trade')
const Transfer = require('./transfer')
const Purchase = require('./purchase')

function defineAssociations() {
  User.hasOne(Wallet, {
    onDelete: 'CASCADE',
    foreignKey: 'userId',
  })
  Wallet.belongsTo(User, { foreignKey: 'userId' })

  Wallet.hasMany(Card, {
    onDelete: 'CASCADE',
  })
  Card.belongsTo(Wallet)

  Wallet.hasMany(Bank, {
    onDelete: 'CASCADE',
  })
  Bank.belongsTo(Wallet)

  // CASCADE is set for data integrity,
  // but users should not be able to deactivate
  // with open trades pending

  // TODO: tried adding a second hasMany with { fk: 'offeree' }
  // user.getOpenTrades() still only returns
  // offeror relations
  // actively researching -- but for now OpenTrades.findAll()
  // with specific where clauses is a work around
  // WRT this application, this is actually convenient
  // however, understanding how to actually make
  // getOpenTrade or getOpenTrades respect the offeree relation
  // is important to understanding complex relations in Sequelize

  User.hasMany(OpenTrade, { foreignKey: 'offeror' })
  OpenTrade.belongsTo(User, {
    foreignKey: { name: 'offeror', allowNull: false },
    onDelete: 'CASCADE',
  })
  OpenTrade.belongsTo(User, {
    foreignKey: 'offeree',
    onDelete: 'CASCADE',
  })
}

function sync(force) {
  defineAssociations()
  return psql.sync({ force })
}

module.exports = {
  User,
  Wallet,
  Card,
  Bank,
  OpenTrade,
  CompletedTrade,
  Transfer,
  Purchase,

  sync,
}
