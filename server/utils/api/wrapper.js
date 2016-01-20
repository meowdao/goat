"use strict";

import q from "q";


function makeError(key) {
	return new Error(`process.env.${key} != true, method is mocked up!`);
}

export function callback(fn) {
	return function (...args) {
		if (process.env[this.constructor.key] === "true") {
			fn.bind(this)(...args);
		} else {
			process.nextTick(() => {
				args[0](makeError(this.constructor.key)); // done
			});
		}
	};
}

export function promise(fn) {
	return function (...args) {
		if (process.env[this.constructor.key] === "true") {
			return fn.bind(this)(...args);
		} else {
			return q.reject(makeError(this.constructor.key));
		}
	};
}

