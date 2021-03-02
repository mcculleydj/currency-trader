const { User } = require('../models')
const { userSchema } = require('./validation')

// user existence verified in authorization middleware

async function update(req, res) {
  const patch = req.body
  const { error } = userSchema.validate(patch)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const result = await User.update(patch, {
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
