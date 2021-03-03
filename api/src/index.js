const express = require('express')

const { sync, User } = require('./models')
const router = require('./routes')

const app = express()

// TODO: user body-parser vs express.json()?
app.use(express.json())

app.use('/', router)

const port = process.env.PORT || 3000

async function init() {
  try {
    await sync(true)
    let user = await User.create({
      name: 'user1',
      password: 'password1',
      confirmPassword: 'password1',
      email: 'user1@gmail.com',
      defaultCurrency: 'usd',
    })
    await user.createWallet({ usd: 100 })
    user = await User.create({
      name: 'user2',
      password: 'password2',
      confirmPassword: 'password2',
      email: 'user2@gmail.com',
      defaultCurrency: 'usd',
    })
    await user.createWallet({ aud: 100 })
  } catch (error) {
    console.log('unable to sync', error)
  }
}

init()

app.listen(3000, () => {
  console.log(`Currency Trader API running on port ${port}...`)
})
