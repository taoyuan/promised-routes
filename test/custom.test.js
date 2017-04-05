'use strict';

const expect = require('chai').expect;
const {bare, makeServer, routing} = require('./support');
const client = require('./client');

describe('custom type routes', () => {
	let server = null;

	before((done) => {
		server = makeServer((app) => {
			app.get('/html/:name', routing.custom('text/html', req => {
				return '<h1>Tsers ' + req.params.name + '!</h1>'
			}));
			app.get('/binary/:filename', routing.custom('application/octet-stream', (req, res) => {
				res.set('Content-Disposition', 'attachment;filename=' + req.params.filename);
				const b = new Buffer(1000);
				b.write('tsers', 20);
				return b
			}))
		}, done)
	});

	after((done) => {
		server.close(done)
	});

	it('support user selected mime types', (done) => {
		client.get('/html/Matti')
			.then(res => {
				expect(res.headers['content-type']).to.equal('text/html; charset=utf-8');
				expect(res.body.toString()).to.equal('<h1>Tsers Matti!</h1>');
			})
			.then(bare(done))
			.done()
	});

	it('support binary body contents', (done) => {
		client.get('/binary/tsers.txt')
			.then(res => {
				const body = new Buffer(res.body, 'binary');
				expect(res.headers['content-disposition']).to.equal('attachment;filename=tsers.txt');
				expect(body.toString('utf8', 20, 20 + 'tsers'.length)).to.equal('tsers');
			})
			.then(bare(done))
			.done()
	})
});
