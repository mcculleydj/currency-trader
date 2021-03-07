require('dotenv').config()
const express = require('express')

const router = require('./routes')
// const { sync, User } = require('./models')

const app = express()

// body-parser ships with Express in the latest version see:
// https://stackoverflow.com/questions/47232187/express-json-vs-bodyparser-json
app.use(express.json())

app.use('/', router)

const port = process.env.PORT || 3000

// async function init() {
//   try {
//     await sync(true)
//     let user1 = await User.create({
//       name: 'user1',
//       password: 'password1',
//       confirmPassword: 'password1',
//       email: 'user1@gmail.com',
//       defaultCurrency: 'usd',
//     })
//     await user1.createWallet({ usd: 100 })
//     user2 = await User.create({
//       name: 'user2',
//       password: 'password2',
//       confirmPassword: 'password2',
//       email: 'user2@gmail.com',
//       defaultCurrency: 'aud',
//     })
//     await user2.createWallet({ aud: 100 })
//   } catch (error) {
//     console.error(error)
//   }
// }

// init()

app.listen(port, () => {
  console.log(`Currency Trader API running on port ${port}...`)
})

module.exports = app
