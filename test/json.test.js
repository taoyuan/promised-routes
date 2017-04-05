'use strict';

const expect = require('chai').expect;
const Bluebird = require('bluebird');
const Q = require('q');
const {bare, makeServer, routing} = require('./support');
const client = require('./client');

describe('JSON routes', () => {
	let server = null;

	before((done) => {
		server = makeServer((app) => {
			app.get('/bluebird/ok', routing.json(() => Bluebird.resolve({msg: 'tsers!'})));
			app.get('/bluebird/nok', routing.json(() => {
				return Bluebird.resolve({})
					.then(() => {
						throw new Error('Some error');
					})
			}));

			app.get('/q/ok', routing.json(() => Q.fcall(() => {
				return {msg: 'tsers!'};
			})));
			app.get('/q/nok', routing.json(() => {
				return Q.fcall(() => {
					throw new Error('Some error');
				})
			}))
		}, done);
	});

	after((done) => {
		server.close(done);
	});

	it('support Bluebird ok values', (done) => {
		client.get('/bluebird/ok')
			.get('body')
			.then(JSON.parse)
			.then((json) => expect(json).to.deep.equals({msg: 'tsers!'}))
			.then(bare(done))
			.done();
	});

	it('support Bluebird nok values', (done) => {
		client.get('/bluebird/nok')
			.then((res) => {
				expect(res.statusCode).to.equal(500);
				expect(res.body.toString()).to.equal('Error: Some error')
			})
			.then(bare(done))
			.done();
	});

	it('support Q ok values', (done) => {
		client.get('/q/ok')
			.get('body')
			.then(JSON.parse)
			.then((json) => expect(json).to.deep.equals({msg: 'tsers!'}))
			.then(bare(done))
			.done();
	});

	it('support Q nok values', (done) => {
		client.get('/q/nok')
			.then((res) => {
				expect(res.statusCode).to.equal(500);
				expect(res.body.toString()).to.equal('Error: Some error');
			})
			.then(bare(done))
			.done();
	});
});
