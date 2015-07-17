'use strict';

let expect     = require('chai').expect,
    Q          = require('q'),
    makeServer = require('./makeServer'),
    client     = require('./client'),
    routes     = require('../index')


describe('route configurations', () => {
  let server = null

  let customRoutes = routes.configure({
    errorHandler: (res, error) => res.json({code: error.code})
  })

  before((done) => {
    server = makeServer((app) => {
      app.get('/error', customRoutes.json(() => Q.fcall(() => { throw {code: 401} })))
    }, done)
  })

  after((done) => {
    server.close(done)
  })


  it('support default value overriding', (done) => {
    client.get('/error')
      .get('body')
      .then(JSON.parse)
      .then(body => expect(body.code).to.equal(401))
      .then(bare(done))
      .done()
  })
})


function bare(fn) {
  return function() { fn() }
}
