const express = require('express')

// middleware
const authorize = require('../util/auth')

// handlers
const authHandlers = require('./auth')
const userHandlers = require('./user')
const walletHandlers = require('./wallet')
const bankHandlers = require('./bank')

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

module.exports = router
