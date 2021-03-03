const express = require('express')

// middleware
const authorize = require('../util/auth')

// handlers
const authHandlers = require('./auth')
const userHandlers = require('./user')
const walletHandlers = require('./wallet')
const bankHandlers = require('./bank')
const cardHandlers = require('./card')
const tradeHandlers = require('./trade')
const transferHandlers = require('./transfer')

const router = express.Router()

// unprotected
router.post('/auth/register', authHandlers.register)
router.post('/auth/login', authHandlers.login)

// protected
router.patch('/user', authorize, userHandlers.update)
router.delete('/user', authorize, userHandlers.remove)
router.get('/wallet', authorize, walletHandlers.get)
router.get('/bank/:id', authorize, bankHandlers.get)
router.get('/bank', authorize, bankHandlers.getAll)
router.post('/bank', authorize, bankHandlers.create)
router.put('/bank', authorize, bankHandlers.update)
router.delete('/bank/:id', authorize, bankHandlers.remove)
router.get('/card/:id', authorize, cardHandlers.get)
router.get('/card', authorize, cardHandlers.getAll)
router.post('/card', authorize, cardHandlers.create)
router.put('/card', authorize, cardHandlers.update)
router.delete('/card/:id', authorize, cardHandlers.remove)
router.get('/trade', authorize, tradeHandlers.getAll)
router.post('/trade', authorize, tradeHandlers.create)
router.patch('/trade', authorize, tradeHandlers.extend)
router.delete('/trade/:id', authorize, tradeHandlers.remove)
router.post('/complete', authorize, tradeHandlers.complete)
router.post('/transfer', authorize, transferHandlers.transfer)
router.post('/purchase', authorize, transferHandlers.purchase)

module.exports = router
