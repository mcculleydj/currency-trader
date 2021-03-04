const { Bank } = require('../models')
const { bankSchema } = require('../validation')

async function get(req, res) {
  try {
    const wallet = await req.user.getWallet()
    const banks = await wallet.getBanks({ where: { id: req.params.id } })

    if (banks.length === 0) {
      return res.status(400).send('bank not found')
    }

    res.send(banks[0])
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function getAll(req, res) {
  try {
    const wallet = await req.user.getWallet()
    res.send(await wallet.getBanks())
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function create(req, res) {
  const { error } = bankSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const wallet = await req.user.getWallet()
    res.send(await wallet.createBank(req.body))
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// unlike PATCH /user
// client must send full object to pass validation
// will use PUT /bank to make this apparent to API consumer
async function update(req, res) {
  const { error } = bankSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const wallet = await req.user.getWallet()
    const banks = await wallet.getBanks({ where: { id: req.body.id } })

    if (banks.length === 0) {
      return res.status(400).send('bank not found')
    }

    const bank = banks[0]
    const { name, accountNumber, routingNumber } = req.body
    bank.name = name
    bank.accountNumber = accountNumber
    bank.routingNumber = routingNumber
    const update = await bank.save()
    res.send(update)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function remove(req, res) {
  try {
    const wallet = await req.user.getWallet()
    const banks = await wallet.getBanks({ where: { id: req.params.id } })

    if (banks.length === 0) {
      return res.status(400).send('bank not found')
    }

    await Bank.destroy({ where: { id: req.params.id } })
    res.send(banks[0])
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  get,
  getAll,
  create,
  update,
  remove,
}
