const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../models')
const { registerSchema, loginSchema } = require('../validation')

async function register(req, res) {
  const { error } = registerSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    if (await User.findOne({ where: { name: req.body.name } })) {
      return res.status(409).send('username already in use')
    }

    // 10 is the number of salt rounds
    // see bcrypt documentation
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    })

    await user.createWallet()
    const userJSON = user.toJSON()
    delete userJSON['password']
    res.send(userJSON)
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
}

async function login(req, res) {
  const { error } = loginSchema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const user = await User.findOne({ where: { name: req.body.name } })

    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).send('unable to authenticate user')
    }

    const token = jwt.sign({ id: user.id }, 'secret')

    res.send({ token })
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
}

module.exports = {
  register,
  login,
}
