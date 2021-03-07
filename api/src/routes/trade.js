const { Op } = require('Sequelize')

const { CompletedTrade, OpenTrade, User } = require('../models')
const { tradeSchema, extendSchema } = require('../util/validation')
const { addHours } = require('../util/functions')
const sequelize = require('../db/postgres')

// TODO: should not be able to transfer or trade more than you have

async function getAll(req, res) {
  try {
    const openTrades = await OpenTrade.findAll({
      where: {
        [Op.or]: [{ offeror: req.user.id }, { offeree: req.user.id }],
      },
    })
    const offerorOpenTrades = []
    const offereeOpenTrades = []

    openTrades.forEach(t => {
      if (t.offeror === req.user.id) offerorOpenTrades.push(t)
      else offereeOpenTrades.push(t)
    })

    const completedTrades = await CompletedTrade.findAll({
      where: {
        [Op.or]: [{ offerorId: req.user.id }, { offereeId: req.user.id }],
      },
    })
    const offerorCompletedTrades = []
    const offereeCompletedTrades = []

    completedTrades.forEach(t => {
      if (t.offeror === req.user.id) offerorCompletedTrades.push(t)
      else offereeCompletedTrades.push(t)
    })

    res.send({
      offerorOpenTrades,
      offereeOpenTrades,
      offerorCompletedTrades,
      offereeCompletedTrades,
    })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function create(req, res) {
  const { error } = tradeSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  if (req.body.type === 'p2p') {
    if (!req.body.offeree) {
      return res
        .status(400)
        .send('peer-to-peer trades must specify the offeree')
    }

    const offeree = await User.findByPk(req.body.offeree)

    // offeree DNE or attempting a trade with self
    if (!offeree || req.body.offeree === req.user.id) {
      return res.status(400).send('cannot trade with this user')
    }
  }

  try {
    req.body.expiry = addHours(req.body.expiry)
    res.send(
      await req.user.createOpenTrade({
        offeror: req.user.id,
        ...req.body,
      })
    )
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// sets a new expiration time
// must be greater than current expiry
async function extend(req, res) {
  const { error } = extendSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const trades = await req.user.getOpenTrades({ where: { id: req.body.id } })

    if (trades.length === 0) {
      return res.status(404).send('trade not found')
    }

    const trade = trades[0]
    const newExpiry = addHours(req.body.expiry)

    if (trade.expiry >= newExpiry) {
      return res
        .status(400)
        .send('new expiry must be later than current expiry')
    }

    trade.expiry = newExpiry
    res.send(await trade.save())
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function remove(req, res) {
  try {
    const trades = await req.user.getOpenTrades({
      where: { id: req.params.id },
    })

    if (trades.length === 0) {
      return res.status(404).send('trade not found')
    }

    const trade = trades[0]
    await OpenTrade.destroy({ where: { id: req.params.id } })
    res.send(trade)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function transact(transaction, trade, offerorWallet, offereeWallet) {
  // will need to handle fractional component in UI
  const payment = trade.rate * trade.offerAmount

  if (offereeWallet[trade.requestedCurrency] < payment) {
    return 'insufficient funds'
  }

  if (offerorWallet[trade.offerCurrency] < trade.offerAmount) {
    return 'offeror has insufficient funds'
  }

  await offerorWallet.decrement(trade.offerCurrency, {
    by: trade.offerAmount,
    transaction,
  })
  await offereeWallet.increment(trade.offerCurrency, {
    by: trade.offerAmount,
    transaction,
  })
  await offereeWallet.decrement(trade.requestedCurrency, {
    by: payment,
    transaction,
  })
  await offerorWallet.increment(trade.requestedCurrency, {
    by: payment,
    transaction,
  })
}

async function complete(req, res) {
  let transaction

  try {
    transaction = await sequelize.transaction()

    const trade = await OpenTrade.findByPk(req.body.id)

    if (trade.offeree && trade.offeree !== req.user.id) {
      return res.sendStatus(403)
    }

    const offeror = await User.findByPk(trade.offeror)
    const offerorWallet = await offeror.getWallet({
      transaction,
      lock: transaction.LOCK.UPDATE,
    })
    const offereeWallet = await req.user.getWallet({
      transaction,
      lock: transaction.LOCK.UPDATE,
    })

    const transactionError = await transact(
      transaction,
      trade,
      offerorWallet,
      offereeWallet
    )

    if (transactionError) {
      await transaction.rollback()
      return res.status(400).send(transactionError)
    }

    // convert open trade into a completed trade
    await CompletedTrade.create(
      {
        offerorId: offeror.id,
        offerorName: offeror.name,
        offereeId: req.user.id,
        offereeName: req.user.name,
        ...trade.toJSON(),
      },
      { transaction }
    )
    await trade.destroy({ transaction })

    // commit and respond
    await transaction.commit()
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    res.sendStatus(500)
  }
}

// need a complete endpoint to update wallets and move trade from
// open table to closed table
// perhaps we'll create a transactions file to hold multi-table operations?

module.exports = {
  getAll,
  create,
  extend,
  remove,
  complete,
}
