const Joi = require('joi')

const { currencies } = require('../util/constants')

const id = Joi.number().integer().min(1)
const name = Joi.string().alphanum().min(3).max(30)
// TODO: use a password complexity lib
const password = Joi.string().alphanum().min(8).max(30)
const confirmPassword = Joi.ref('password')
const email = Joi.string().email({ minDomainSegments: 2 })
const defaultCurrency = Joi.string().valid(...currencies)
const amount = Joi.number().min(0)

const registerSchema = Joi.object({
  name: name.required(),
  password: password.required(),
  confirmPassword,
  email: email.required(),
  defaultCurrency: defaultCurrency.required(),
}).with('password', 'confirmPassword')

const loginSchema = Joi.object({
  name: Joi.required(),
  password: Joi.required(),
})

const userSchema = Joi.object({
  name,
  password,
  confirmPassword,
  email,
  defaultCurrency,
}).with('password', 'confirmPassword')

const bankSchema = Joi.object({
  id,
  name: Joi.string().required(),
  accountNumber: Joi.string().pattern(new RegExp('^[0-9]*$')).required(),
  routingNumber: Joi.string().pattern(new RegExp('^[0-9]{9}$')),
})

const cardSchema = Joi.object({
  id,
  number: Joi.string().creditCard().required(),
  ccv: Joi.string().pattern(new RegExp('^[0-9]{3}$')).required(),
  expiry: Joi.string().pattern(new RegExp('^[0-9]{2}/[0-9]{2}$')),
  zip: Joi.string().pattern(new RegExp('^[0-9]{5}$')),
})

const tradeSchema = Joi.object({
  type: Joi.string().valid('p2p', 'open').required(),
  offeree: Joi.number().integer().min(1),
  offerCurrency: Joi.string()
    .valid(...currencies)
    .required(),
  offerAmount: amount.required(),
  requestedCurrency: Joi.string()
    .valid(...currencies)
    .required(),
  // number of hours before this trade expires
  expiry: Joi.number().integer().min(1).max(24),
  rate: Joi.number().min(0).required(),
})

const extendSchema = Joi.object({
  id: id.required(),
  expiry: Joi.number().integer().min(1).max(24),
})

const completeSchema = Joi.object({
  id: id.required(),
})

const purchaseSchema = Joi.object({
  method: Joi.string().valid('card', 'bank').required(),
  methodId: id.required(),
  description: Joi.string().required(),
  amount: amount.required(),
  currency: Joi.string()
    .valid(...currencies)
    .required(),
})

const transferSchema = Joi.object({
  destination: id.required(),
  amount: amount.required(),
})

module.exports = {
  registerSchema,
  loginSchema,
  userSchema,
  bankSchema,
  cardSchema,
  tradeSchema,
  extendSchema,
  completeSchema,
  purchaseSchema,
  transferSchema,
}
