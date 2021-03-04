const { Card } = require('../models')
const { cardSchema } = require('../util/validation')

async function get(req, res) {
  try {
    const wallet = await req.user.getWallet()
    const cards = await wallet.getCards({ where: { id: req.params.id } })

    if (cards.length === 0) {
      return res.status(400).send('card not found')
    }

    res.send(cards[0])
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function getAll(req, res) {
  try {
    const wallet = await req.user.getWallet()
    res.send(await wallet.getCards())
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function create(req, res) {
  const { error } = cardSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const wallet = await req.user.getWallet()
    res.send(await wallet.createCard(req.body))
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// unlike PATCH /user
// client must send full object to pass validation
// will use PUT /card to make this apparent to API consumer
async function update(req, res) {
  const { error } = cardSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const wallet = await req.user.getWallet()
    const cards = await wallet.getCards({ where: { id: req.body.id } })

    if (cards.length === 0) {
      return res.status(400).send('card not found')
    }

    const card = cards[0]
    const { number, ccv, expiry, zip } = req.body
    card.number = number
    card.ccv = ccv
    card.expiry = expiry
    card.zip = zip
    const update = await card.save()
    res.send(update)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function remove(req, res) {
  try {
    const wallet = await req.user.getWallet()
    const cards = await wallet.getCards({ where: { id: req.params.id } })

    if (cards.length === 0) {
      return res.status(400).send('card not found')
    }

    await Card.destroy({ where: { id: req.params.id } })
    res.send(cards[0])
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
