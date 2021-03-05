const jwt = require('jsonwebtoken')

const { User } = require('../models')

async function authorize(req, res, next) {
  const bearerToken = req.get('Authorization')

  if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
    return res.sendStatus(401)
  }

  const token = bearerToken.split('Bearer ')[1]
  let id

  try {
    id = jwt.verify(token, 'secret').id
    if (!id) throw 'missing id'
  } catch (error) {
    return res.sendStatus(401)
  }

  try {
    const user = await User.findByPk(id)

    if (!user) {
      res.status(404).send('User Not Found')
    }

    req.user = user
    next()
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = { authorize }
