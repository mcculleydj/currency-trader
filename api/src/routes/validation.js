const Joi = require('joi')

const { currencies } = require('../util/constants')

// user property validation
const name = Joi.string().alphanum().min(3).max(30)
const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
const confirmPassword = Joi.ref('password')
const email = Joi.string().email({ minDomainSegments: 2 })
const defaultCurrency = Joi.string().valid(...currencies)

const registerSchema = Joi.object({
  name: name.required(),
  password: password.required(),
  confirmPassword,
  email: email.required(),
  defaultCurrency: defaultCurrency.required(),
}).with('password', 'confirmPassword')

const loginSchema = Joi.object({
  name: name.required(),
  password: password.required(),
})

const userSchema = Joi.object({
  name,
  password,
  confirmPassword,
  email,
  defaultCurrency,
}).with('password', 'confirmPassword')

const bankSchema = Joi.object({
  name: Joi.string().required(),
  accountNumber: Joi.string().alphanum().required(),
  routingNumber: Joi.string().pattern(new RegExp('^[0-9]{9}$')),
})

module.exports = {
  registerSchema,
  loginSchema,
  userSchema,
  bankSchema,
}
