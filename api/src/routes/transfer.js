const sequelize = require('../db/postgres')
const { transferSchema, purchaseSchema } = require('../util/validation')

// TODO: should not be able to transfer or trade more than you have

async function transfer(req, res) {
  const { error } = transferSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  let transaction

  try {
    transaction = await sequelize.transaction()

    const wallet = await req.user.getWallet()

    if (req.body.amount > wallet[req.user.defaultCurrency]) {
      return res.status(400).send('insufficient funds')
    }

    const banks = await wallet.getBanks({
      where: { id: req.body.destinationId },
    })

    if (banks.length === 0) {
      return res.status(404).send('bank not found')
    }

    const bank = banks[0]

    // simulate xfer to bank by decrementing
    // default currency in wallet
    await wallet.decrement(req.user.defaultCurrency, {
      by: req.body.amount,
      transaction,
    })

    const transferInstance = await Transfer.create(
      {
        destination: bank.name,
        amount: req.body.amount,
      },
      { transaction }
    )

    await transaction.commit()

    res.send(transferInstance)
  } catch (error) {
    console.error(error)
    transaction.rollback()
    res.sendStatus(500)
  }
}

async function purchase(req, res) {
  const { error } = purchaseSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  let transaction

  try {
    const wallet = await req.user.getWallet()

    let description

    if (req.body.method === 'card') {
      const cards = await wallet.getCards({ where: { id: req.body.methodId } })

      if (cards.length === 0) {
        return res.status(404).send('card not found')
      }

      description = `x${cards[0].number.slice(12, 15)}`
    } else {
      const banks = await wallet.getBanks({ where: { id: req.body.methodId } })

      if (banks.length === 0) {
        return res.status(404).send('bank not found')
      }

      description = banks[0].name
    }

    // simulate xfer to currency trader
    // by incrementing purchased currency

    // TODO:
    // rate will not be passed in a purchase request,
    // instead will be looked up using gRPC service
    // and amount of currency that the amount spent buys
    // will be calculated in real time here

    const LOOKUP_RATE = 0.85

    await wallet.increment(req.body.currency, {
      by: req.body.amount * LOOKUP_RATE,
      transaction,
    })

    const purchaseInstance = await Purchase.create(
      {
        description,
        ...req.body,
      },
      { transaction }
    )

    await transaction.commit()

    res.send(transferInstance)
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    res.sendStatus(500)
  }
}

module.exports = { transfer, purchase }
