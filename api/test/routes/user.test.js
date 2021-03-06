const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')

const auth = require('../../src/util/auth')
const { User } = require('../../src/models')

chai.use(chaiHttp)

describe('routes/user', function () {
  let app
  const defaultUser = () => ({
    id: 1,
    name: 'test',
    email: 'test@test.com',
    password: 'testPassword',
    defaultCurrency: 'usd',
  })

  before(() => {
    sinon.stub(auth, 'authorize').callsFake(function (req, _, next) {
      req.user = defaultUser()
      next()
    })
    app = require('../../src')
  })

  describe('update', function () {
    it('should send a 400 when update body name has non-alphanumeric or is not 3 to 30 characters in length', function () {
      chai
        .request(app)
        .patch('/user')
        .send({
          name: 'test!',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .patch('/user')
        .send({
          name: 'te',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .patch('/user')
        .send({
          name: 'testtesttesttesttesttesttesttes',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body password has non-alphanumeric or is not 8 to 30 characters in length', function () {
      chai
        .request(app)
        .patch('/user')
        .send({
          password: 'test!',
          confirmPassword: 'test!',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .patch('/user')
        .send({
          password: 'testtes',
          confirmPassword: 'testtes',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .patch('/user')
        .send({
          password: 'testtesttesttesttesttesttesttes',
          confirmPassword: 'testtesttesttesttesttesttesttes',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body password exists without a confirmPassword property', function () {
      chai
        .request(app)
        .patch('/user')
        .send({
          password: 'testPassword',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body password does not match confirmPassword', function () {
      chai
        .request(app)
        .patch('/user')
        .send({
          password: 'testPassword',
          confirmPassword: 'testPassword2',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body email is not a valid email', function () {
      chai
        .request(app)
        .patch('/user')
        .send({
          email: 'testEmail',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
      chai
        .request(app)
        .patch('/user')
        .send({
          email: 'testEmail@test',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 400 when update body defaultCurrency is not a valid currency', function () {
      chai
        .request(app)
        .patch('/user')
        .send({
          defaultCurrency: 'test',
        })
        .end((_, res) => {
          expect(res.status).to.equal(400)
        })
    })

    it('should send a 500 if user update rejects', async function () {
      // User.update.returns(Promise.reject()) results in:
      // PromiseRejectionHandledWarning: Promise rejection was handled asynchronously
      sinon.stub(User, 'update').callsFake(() => Promise.reject())
      const res = await chai.request(app).patch('/user').send({ name: 'test' })
      expect(res.status).to.equal(500)
      User.update.restore()
    })

    it('should respond with the updated user without a password if the request is valid', async function () {
      sinon.stub(User, 'update')
      const updateResponse = [
        1,
        [
          {
            toJSON: () => ({
              ...defaultUser(),
              name: 'updatedName',
            }),
          },
        ],
      ]
      User.update.returns(Promise.resolve(updateResponse))
      const res = await chai
        .request(app)
        .patch('/user')
        .send({ name: 'updatedName' })
      expect(res.status).to.equal(200)
      expect(res.body.name).to.equal('updatedName')
      expect(res.body.password).to.be.undefined
      User.update.restore()
    })
  })

  describe('remove', function () {
    it('should send a 500 if user findOne rejects', async function () {
      sinon.stub(User, 'findOne').callsFake(() => Promise.reject())
      const res = await chai.request(app).delete('/user')
      expect(res.status).to.equal(500)
      User.findOne.restore()
    })

    it('should send a 404 if user not found', async function () {
      sinon.stub(User, 'findOne').returns(Promise.resolve(null))
      const res = await chai.request(app).delete('/user')
      expect(res.status).to.equal(404)
      expect(res.text).to.equal('User Not Found')
      User.findOne.restore()
    })

    it('should send a 500 if user getWallet rejects', async function () {
      const user = {
        ...defaultUser(),
        getWallet: () => Promise.reject(),
      }
      sinon.stub(User, 'findOne').callsFake(() => Promise.resolve(user))
      const res = await chai.request(app).delete('/user')
      expect(res.status).to.equal(500)
      User.findOne.restore()
    })

    it('should send a 400 if user has currency in wallet', async function () {
      const user = {
        ...defaultUser(),
        getWallet: () =>
          Promise.resolve({
            usd: 1,
            eur: 0,
            jpy: 0,
            gbp: 0,
            aud: 0,
            cad: 0,
            chf: 0,
            cny: 0,
            hkd: 0,
            nzd: 0,
          }),
      }
      sinon.stub(User, 'findOne').callsFake(() => Promise.resolve(user))
      const res = await chai.request(app).delete('/user')
      expect(res.status).to.equal(400)
      expect(res.text).to.equal(
        'cannot deactivate account with currency in wallet'
      )
      User.findOne.restore()
    })

    it('should send a 400 if user has open trades', async function () {
      const user = {
        ...defaultUser(),
        getWallet: () =>
          Promise.resolve({
            usd: 0,
            eur: 0,
            jpy: 0,
            gbp: 0,
            aud: 0,
            cad: 0,
            chf: 0,
            cny: 0,
            hkd: 0,
            nzd: 0,
          }),
        getOpenTrades: () => [{}],
      }
      sinon.stub(User, 'findOne').callsFake(() => Promise.resolve(user))
      const res = await chai.request(app).delete('/user')
      expect(res.status).to.equal(400)
      expect(res.text).to.equal('cannot deactivate account with open trades')
      User.findOne.restore()
    })

    it('should send a 500 if user destroy rejects', async function () {
      const user = {
        ...defaultUser(),
        getWallet: () =>
          Promise.resolve({
            usd: 0,
            eur: 0,
            jpy: 0,
            gbp: 0,
            aud: 0,
            cad: 0,
            chf: 0,
            cny: 0,
            hkd: 0,
            nzd: 0,
          }),
        getOpenTrades: () => [],
      }
      sinon.stub(User, 'findOne').callsFake(() => Promise.resolve(user))
      sinon.stub(User, 'destroy').callsFake(() => Promise.reject())
      const res = await chai.request(app).delete('/user')
      expect(res.status).to.equal(500)
      User.findOne.restore()
      User.destroy.restore()
    })

    it('should call user destroy targeting the correct ID for valid requests', async function () {
      const user = {
        ...defaultUser(),
        getWallet: () =>
          Promise.resolve({
            usd: 0,
            eur: 0,
            jpy: 0,
            gbp: 0,
            aud: 0,
            cad: 0,
            chf: 0,
            cny: 0,
            hkd: 0,
            nzd: 0,
          }),
        getOpenTrades: () => [],
      }
      sinon.stub(User, 'findOne').callsFake(() => Promise.resolve(user))
      sinon.stub(User, 'destroy').callsFake(() => Promise.resolve(user))
      const res = await chai.request(app).delete('/user')
      expect(res.status).to.equal(200)
      expect(User.destroy).to.have.been.calledWith(
        sinon.match({ where: { id: 1 } })
      )
      // user object is heavily modified for this test
      // simply check name to be sure this endpoint is sending back a user object
      // unlike in auth middleware stripping the password happens at the DB level
      expect(res.body.name).to.equal('test')
      User.findOne.restore()
      User.destroy.restore()
    })
  })

  after(function () {
    auth.authorize.restore()
  })
})
