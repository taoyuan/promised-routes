'use strict';

module.exports = function () {
	const hasOwn = Object.prototype.hasOwnProperty;
	const result = {};

	const len = arguments.length;

	let obj;
	let key;
	for (let i = 0; i < len; ++i) {
		obj = arguments[i];

		for (key in obj) {
			if (hasOwn.call(obj, key)) {
				result[key] = obj[key];
			}
		}
	}

	return result;
};
