const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

// should client instantiation happen in this file?

const PROTO_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'exchange',
  'proto',
  'exchange.proto'
)

// TODO: review protoLoader options
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const { exchange: proto } = grpc.loadPackageDefinition(packageDefinition)
// does this need to be closed?
// will it stay live?
const stub = new proto.Exchange(
  'localhost:4000',
  grpc.credentials.createInsecure()
)

function getRate(base, quote) {
  return new Promise((res, rej) => {
    stub.getRate({ base, quote }, (err, rate) => {
      if (err) rej(err)
      else res(rate)
    })
  })
}

function getRates(currency) {
  return new Promise((res, rej) => {
    stub.getRates({ currency }, (err, rates) => {
      if (err) rej(err)
      else res(rates)
    })
  })
}

function getHistoricalRates(currency) {
  // might do something else with the stream
  // other than just exhaust it into an array
  return new Promise((res, rej) => {
    const stream = stub.getHistoricalRates({ currency })
    const rates = []
    // figure out how to trigger end using Go => Node
    // EOF is an error
    stream.on('data', rate => rates.push(rate))
    stream.on('error', rej)
    stream.on('end', () => res(rates))
  })
}

module.exports = {
  getRate,
  getRates,
  getHistoricalRates,
}
