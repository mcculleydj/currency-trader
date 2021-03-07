require('dotenv').config()
const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const auth = require('../../src/util/auth')
const { User } = require('../../src/models')
const user = require('../../src/models/user')

chai.use(chaiHttp)

describe('routes/auth', function () {
  // TODO: should not need to stub authorize for the auth routes
  // but failing to do so, breaks user route tests
  let app
  const defaultUser = () => ({
    id: 1,
    name: 'test',
    email: 'test@test.com',
    password: 'testPassword',
    defaultCurrency: 'usd',
  })

  before(function () {
    sinon.stub(auth, 'authorize').callsFake(function (req, _, next) {
      req.user = defaultUser()
      next()
    })
    app = require('../../src')
  })

  beforeEach(function () {
    sinon.stub(User, 'findOne')
    sinon.stub(User, 'create')
  })

  afterEach(function () {
    User.findOne.restore()
    User.create.restore()
  })

  after(function () {
    auth.authorize.restore()
  })

  describe('register', function () {
    it('should send a 400 when update body name DNE, has non-alphanumeric characters, or is not 3 to 30 characters in length', function () {
      chai
        .request(app)
        .post('/auth/register')
        .send({
          password: 'password',
          confirmPassword: 'password',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test!',
          password: 'password',
          confirmPassword: 'password',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'te',
          password: 'password',
          confirmPassword: 'password',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'testtesttesttesttesttesttesttes',
          password: 'password',
          confirmPassword: 'password',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body password DNE, has non-alphanumeric characters, or is not 8 to 30 characters in length', function () {
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'test!',
          confirmPassword: 'test!',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'testtes',
          confirmPassword: 'testtes',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'testtesttesttesttesttesttesttes',
          confirmPassword: 'testtesttesttesttesttesttesttes',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body password exists without a confirmPassword property', function () {
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'testPassword',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body password does not match confirmPassword', function () {
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'testPassword',
          password: 'testPassword2',
          email: 'test@test.com',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body email DNE or is not a valid email', function () {
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'password',
          confirmPassword: 'password',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'password',
          confirmPassword: 'password',
          email: 'test@test',
          defaultCurrency: 'usd',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body defaultCurrency DNE or is not a valid currency', function () {
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'password',
          confirmPassword: 'password',
          email: 'test@test.com',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/register')
        .send({
          name: 'test',
          password: 'password',
          confirmPassword: 'password',
          email: 'test@test.com',
          defaultCurrency: 'test',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 409 if name is already in use', async function () {
      User.findOne.returns(Promise.resolve(defaultUser()))
      const res = await chai.request(app).post('/auth/register').send({
        name: 'test',
        password: 'password',
        confirmPassword: 'password',
        email: 'test@test.com',
        defaultCurrency: 'usd',
      })
      expect(res.status).to.equal(409)
      expect(res.text).to.equal('username already in use')
    })

    it('should send a 500 if an async model method rejects', async function () {
      User.findOne.callsFake(() => Promise.reject())
      const res = await chai.request(app).post('/auth/register').send({
        name: 'test',
        password: 'password',
        confirmPassword: 'password',
        email: 'test@test.com',
        defaultCurrency: 'usd',
      })
      expect(res.status).to.equal(500)
    })

    it('should call user create with the hashed password', async function () {
      User.findOne.returns(Promise.resolve(null))
      User.create.returns(
        Promise.resolve({
          createWallet: () => Promise.resolve(),
          toJSON: defaultUser,
        })
      )
      await chai.request(app).post('/auth/register').send({
        name: 'test',
        password: 'password',
        confirmPassword: 'password',
        email: 'test@test.com',
        defaultCurrency: 'usd',
      })
      expect(User.create).to.have.been.called
      const args = User.create.getCall(0).args[0]
      expect(bcrypt.compareSync('password', args.password)).to.equal(true)
      expect(args.name).to.equal('test')
    })

    it('should create a wallet for new users', async function () {
      User.findOne.returns(Promise.resolve(null))
      const mockUser = {
        createWallet: () => Promise.resolve(),
        toJSON: defaultUser,
      }
      User.create.returns(Promise.resolve(mockUser))
      sinon.stub(mockUser, 'createWallet')
      await chai.request(app).post('/auth/register').send({
        name: 'test',
        password: 'password',
        confirmPassword: 'password',
        email: 'test@test.com',
        defaultCurrency: 'usd',
      })
      expect(mockUser.createWallet).to.have.been.called
      mockUser.createWallet.restore()
    })

    it('should send the new user without a password property', async function () {
      User.findOne.returns(Promise.resolve(null))
      User.create.returns(
        Promise.resolve({
          createWallet: () => Promise.resolve(),
          toJSON: defaultUser,
        })
      )
      const res = await chai.request(app).post('/auth/register').send({
        name: 'test',
        password: 'password',
        confirmPassword: 'password',
        email: 'test@test.com',
        defaultCurrency: 'usd',
      })
      expect(res.status).to.equal(200)
      expect(res.body).to.eql({
        id: 1,
        name: 'test',
        email: 'test@test.com',
        defaultCurrency: 'usd',
      })
    })
  })

  describe('login', function () {
    it('should send a 400 response when name or password is missing', function () {
      chai
        .request(app)
        .post('/auth/login')
        .send({
          name: 'test',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .post('/auth/login')
        .send({
          password: 'test',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 500 response if user findOne rejects', async function () {
      User.findOne.callsFake(() => Promise.reject())
      const res = await chai.request(app).post('/auth/login').send({
        name: 'test',
        password: 'test',
      })
      expect(res.status).to.equal(500)
    })

    it('should send a 401 response if user DNE', async function () {
      User.findOne.callsFake(() => Promise.resolve(null))
      const res = await chai.request(app).post('/auth/login').send({
        name: 'test',
        password: 'test',
      })
      expect(res.status).to.equal(401)
    })

    it('should send a 401 response if password does not match', async function () {
      User.findOne.callsFake(() =>
        Promise.resolve({
          name: 'test',
          password: 'notTestHashed',
        })
      )
      const res = await chai.request(app).post('/auth/login').send({
        name: 'test',
        password: 'test',
      })
      expect(res.status).to.equal(401)
    })

    it('should send a valid JWT with the user ID in the payload', async function () {
      User.findOne.callsFake(() =>
        Promise.resolve({
          id: 1,
          name: 'test',
          password: 'password',
        })
      )
      sinon.stub(bcrypt, 'compareSync').returns(true)
      const res = await chai.request(app).post('/auth/login').send({
        name: 'test',
        password: 'password',
      })
      expect(res.status).to.equal(200)
      const { id } = jwt.verify(res.body.token, process.env.JWT_SECRET)
      expect(id).to.equal(1)
      bcrypt.compareSync.restore()
    })
  })
})
