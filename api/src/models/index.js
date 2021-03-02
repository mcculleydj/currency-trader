const psql = require('../db/postgres')

const User = require('./user')
const Wallet = require('./wallet')
const Card = require('./card')
const Bank = require('./bank')
const OpenTrade = require('./open_trade')
const CompletedTrade = require('./completed_trade')

// TODO: double check delete behaviors
function defineAssociations() {
  User.hasOne(Wallet, {
    onDelete: 'CASCADE',
  })
  Wallet.belongsTo(User, {
    foreignKey: 'userId',
  })

  Wallet.hasMany(Card, {
    onDelete: 'CASCADE',
  })
  Card.belongsTo(Wallet)

  Wallet.hasMany(Bank, {
    onDelete: 'CASCADE',
  })
  Bank.belongsTo(Wallet)

  // CASCADE is set, but users will not be able to
  // delete their account with open trades pending
  User.hasMany(OpenTrade)
  OpenTrade.belongsTo(User, {
    foreignKey: {
      name: 'offeror',
      allowNull: false,
    },
    onDelete: 'CASCADE',
  })
  OpenTrade.belongsTo(User, { foreignKey: 'offeree', onDelete: 'CASCADE' })
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

  sync,
}
