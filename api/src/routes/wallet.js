const { Wallet } = require('../models')

async function get(req, res) {
  console.log('\n\nhello')
  try {
    const wallet = await Wallet.findOne({ where: { userId: req.user.id } })

    if (!wallet) {
      return res.status(404).send('wallet not found')
    }

    res.send(wallet)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = { get }
