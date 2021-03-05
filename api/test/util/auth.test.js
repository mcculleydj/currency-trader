const { expect } = require('chai')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const jwt = require('jsonwebtoken')

chai.use(sinonChai)

const { authorize } = require('../../src/util/auth')
const { User } = require('../../src/models')

describe('util/auth', function () {
  it('should send a 401 if token is missing', function () {
    const req = {
      get: () => {},
    }
    const res = {
      sendStatus: () => {},
    }
    sinon.stub(res, 'sendStatus')
    authorize(req, res, () => {})
    expect(res.sendStatus).to.have.been.calledWith(401)
  })

  it('should send a 401 if token is malformed', function () {
    const req = {
      get: () => 'not Bearer token',
    }
    const res = {
      sendStatus: () => {},
    }
    sinon.stub(res, 'sendStatus')
    authorize(req, res, () => {})
    expect(res.sendStatus).to.have.been.calledWith(401)
  })

  it('should send a 401 if JWT is invalid', function () {
    const req = {
      get: () => 'Bearer invalidToken',
    }
    const res = {
      sendStatus: () => {},
    }
    sinon.stub(res, 'sendStatus')
    authorize(req, res, () => {})
    expect(res.sendStatus).to.have.been.calledWith(401)
  })

  it('should send a 401 if JWT payload does not have an id property', function () {
    const req = {
      get: () => 'Bearer validToken',
    }
    const res = {
      sendStatus: () => {},
    }
    sinon.stub(res, 'sendStatus')
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({})
    authorize(req, res, () => {})
    expect(res.sendStatus).to.have.been.calledWith(401)
    jwt.verify.restore()
  })

  it('should look up the user by ID after the token is verified', async function () {
    const req = {
      get: () => 'Bearer validToken',
    }
    sinon.stub(jwt, 'verify')
    sinon.stub(User, 'findByPk')
    jwt.verify.returns({ id: 1 })
    User.findByPk.returns(Promise.resolve({}))
    await authorize(req, {}, () => {})
    expect(User.findByPk).to.have.been.calledWith(1)
    jwt.verify.restore()
    User.findByPk.restore()
  })

  it('should send a 404 with "User Not Found" if no user matches the supplied ID', async function () {
    const req = {
      get: () => 'Bearer validToken',
    }
    const res = {
      sendStatus: () => {},
      status: () => {},
      send: () => {},
    }
    sinon.stub(jwt, 'verify')
    sinon.stub(User, 'findByPk')
    sinon.stub(res, 'send')
    sinon.stub(res, 'status')
    jwt.verify.returns({ id: 1 })
    User.findByPk.returns(Promise.resolve(null))
    res.status.returns(res)
    await authorize(req, res, () => {})
    expect(res.status).to.have.been.calledWith(404)
    expect(res.send).to.have.been.calledWith('User Not Found')
    jwt.verify.restore()
    User.findByPk.restore()
  })

  it('should define the user property on req if a user is found', async function () {
    const req = {
      get: () => 'Bearer validToken',
    }
    const res = {
      sendStatus: () => {},
      status: () => {},
      send: () => {},
    }
    const user = { name: 'testUser' }
    sinon.stub(jwt, 'verify')
    sinon.stub(User, 'findByPk')
    jwt.verify.returns({ id: 1 })
    User.findByPk.returns(Promise.resolve(user))
    await authorize(req, res, () => {})
    expect(req.user).to.equal(user)
    jwt.verify.restore()
    User.findByPk.restore()
  })

  it('should call next if a user is found', async function () {
    const req = {
      get: () => 'Bearer validToken',
    }
    const res = {
      sendStatus: () => {},
      status: () => {},
      send: () => {},
    }
    const user = { name: 'testUser' }
    sinon.stub(jwt, 'verify')
    sinon.stub(User, 'findByPk')
    jwt.verify.returns({ id: 1 })
    User.findByPk.returns(Promise.resolve(user))
    const next = sinon.fake()
    await authorize(req, res, next)
    expect(next).to.have.been.called
    jwt.verify.restore()
    User.findByPk.restore()
  })

  it('should send a 500 if user look up throws an error', async function () {
    const req = {
      get: () => 'Bearer validToken',
    }
    const res = {
      sendStatus: () => {},
      status: () => {},
      send: () => {},
    }
    sinon.stub(jwt, 'verify')
    sinon.stub(User, 'findByPk').callsFake(() => Promise.reject())
    sinon.stub(res, 'sendStatus')
    jwt.verify.returns({ id: 1 })
    await authorize(req, res, () => {})
    expect(res.sendStatus).to.have.been.calledWith(500)
    jwt.verify.restore()
    User.findByPk.restore()
  })
})
