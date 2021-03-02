const express = require('express')

const { sync } = require('./models')
const router = require('./routes')

const app = express()

// TODO: user body-parser vs express.json()?
app.use(express.json())

app.use('/', router)

const port = process.env.PORT || 3000

async function init() {
  try {
    await sync(true)
  } catch (error) {
    console.log('unable to sync', error)
  }
}

init()

app.listen(3000, () => {
  console.log(`Currency Trader API running on port ${port}...`)
})
