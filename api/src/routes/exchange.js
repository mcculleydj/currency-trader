const exchangeService = require('../services/exchange')

async function getRate(req, res) {
  try {
    const rate = await exchangeService.getRate(req.query.base, req.query.quote)
    res.send(rate)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function getRates(req, res) {
  try {
    const rates = await exchangeService.getRates(req.query.currency)
    res.send(rates)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

async function getHistoricalRates(req, res) {
  try {
    const rates = await exchangeService.getHistoricalRates(req.query.currency)
    res.send(rates)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = { getRate, getRates, getHistoricalRates }
