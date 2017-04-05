'use strict';

const expect = require('chai').expect;
const Q = require('q');
const {bare, makeServer, routing} = require('./support');
const client = require('./client');

describe('route configurations', () => {
	let server = null;

	const customRoutes = routing.configure({
		errorHandler: (res, error) => res.json({code: error.code})
	});

	before((done) => {
		server = makeServer((app) => {
			app.get('/error', customRoutes.json(() => Q.fcall(() => {
				const err = new Error();
				err.code = 401;
				throw err;
			})))
		}, done)
	});

	after((done) => {
		server.close(done)
	});

	it('support default value overriding', (done) => {
		client.get('/error')
			.get('body')
			.then(JSON.parse)
			.then(body => expect(body.code).to.equal(401))
			.then(bare(done))
			.done()
	})
});
