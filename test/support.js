'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const routing = require('..');

exports.bare = fn => () => fn();

exports.makeServer = (initRoutesCb, serverUpCb) => {
	const app = express();

	app.use(bodyParser.json());
	initRoutesCb(app);

	const server = app.listen(3000, () => serverUpCb());
	return {
		close: (cb) => server.close(() => cb())
	};
};

exports.routing = routing.create({
	errorHandler: (response, error) => {
		response
			.status(500)
			.send(error !== undefined && error !== null ? error.toString() : '');
	}
});
