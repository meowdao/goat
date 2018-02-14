import bluebird from "bluebird";
import {makeError} from "../../utils/error";


export function test(fn) {
	return function testInner(...args) {
		if (process.env.NODE_ENV === "test") {
			return args[0]();
		} else {
			return fn.bind(this)(...args);
		}
	};
}

export function callback(fn) {
	return function callbackInner(...args) {
		if (process.env[this.constructor.name.toUpperCase()] === "true") {
			fn.bind(this)(...args);
		} else {
			process.nextTick(() => {
				args[0](makeError("mocked-up", 500, this.constructor)); // done
			});
		}
	};
}

export function promise(fn) {
	return function promiseInner(...args) {
		if (process.env[this.constructor.name.toUpperCase()] === "true") {
			return fn.bind(this)(...args);
		} else {
			return bluebird.reject(makeError("mocked-up", 500, this.constructor));
		}
	};
}
