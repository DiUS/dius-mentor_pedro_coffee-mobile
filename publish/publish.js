const pact = require('@pact-foundation/pact-node')
const path = require('path')
const pjson = require('./package.json')
const opts = {
  pactUrls: [path.resolve(__dirname, '../pacts/coffee_mobile_consumer-coffee_ordering_provider.json')],
  pactBroker: 'https://'+process.env.pactBrokerAccount+'.pact.dius.com.au',
  pactBrokerUsername: process.env.pactBrokerUsername,
  pactBrokerPassword: process.env.pactBrokerPassword,
  tags: ['prod', 'test'],
  consumerVersion: pjson.version
}

pact.publishPacts(opts)
  .then(() => {
    console.log('Pact contract publishing complete!')
  })
  .catch(e => {
    console.log('Pact contract publishing failed: ', e)
  })
