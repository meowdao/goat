import q from "q";


function makeError(key) {
	return new Error(`process.env.${key} != true, method is mocked up!`); // TODO i18n
}

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
	return function promiseInner(...args) {
		if (process.env[this.constructor.key] === "true") {
			return fn.bind(this)(...args);
		} else {
			return q.reject(makeError(this.constructor.key));
		}
	};
}
