'use strict';

const merge = require('./merge');

class Routing {
	constructor(options) {
		this._opts = options || {};
	}

	create(options) {
		return new Routing(merge({}, this._opts, options));
	}

	configure(options) {
		return this.create(options);
	}

	json(fn) {
		return route(this._opts, (res, value) => res.json(value))(fn);
	}

	jsonp(fn) {
		return route(this._opts, (res, value) => res.jsonp(value))(fn);
	}

	custom(mimeType, fn) {
		return route(this._opts, (res, value) => {
			res.set('Content-Type', mimeType);
			res.send(value);
		})(fn);
	}
}

const routing = module.exports = new Routing();
routing.Routing = Routing;

function route(opts, sendFn) {
	return function (fn) {
		return function (req, res, next) {
			try {
				const value = fn(req, res);
				_done(_catch(_then(value, handleValue), handleError));
			} catch (error) {
				handleError(error);
			}

			function handleValue(value) {
				sendFn(res, value);
			}

			function handleError(error) {
				if (opts.errorHandler) {
					opts.errorHandler(res, error);
				} else {
					next(error);
				}
			}
		};
	};
}

function _then(val, cb) {
	if (val && typeof val.then === 'function') {
		return val.then(cb);
	} else {
		cb(val);
	}
}

function _catch(val, cb) {
	if (val && typeof val.catch === 'function') {
		return val.catch(cb);
	}
}

function _done(val) {
	if (val && typeof val.done === 'function') {
		val.done();
	}
}
