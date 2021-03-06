const { User } = require('../models')
const { userSchema } = require('../util/validation')
const { currencies } = require('../util/constants')

// user existence verified in authorization middleware

async function update(req, res) {
  const { error } = userSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const result = await User.update(req.body, {
      where: { id: req.user.id },
      returning: true,
    })
    const user = result[1][0].toJSON()
    delete user['password']
    res.send(user)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function remove(req, res) {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      return res.status(404).send('User Not Found')
    }

    // wallet must be empty before deactivating
    const wallet = await user.getWallet()
    if (currencies.some(c => wallet[c])) {
      return res
        .status(400)
        .send('cannot deactivate account with currency in wallet')
    }

    // getOpenTrades only returns trades where this user is the offeror
    // being offered a trade should not preclude a user from deactivating

    // TODO: certain that this will be []?
    const openTrades = await user.getOpenTrades()

    // do not allow users with open trades to deactivate
    if (openTrades.length > 0) {
      return res.status(400).send('cannot deactivate account with open trades')
    }

    await User.destroy({ where: { id: req.user.id } })
    res.send(user)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  remove,
  update,
}
