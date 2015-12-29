"use strict";

import q from "q";

export default {

	callback(func) {
		return function wrapperCallback(...args) {
			if (process.env[this.key] === "true") {
				func.bind(this)(...args);
			} else {
				process.nextTick(() => {
					args[0](); // done
				});
			}
		};
	},

	promise(func) {
		return function wrapperPromise(...args) {
			if (process.env[this.key] === "true") {
				return func.bind(this)(...args);
			} else {
				return q({
					success: false,
					message: `process.env.${this.key} != true, method is mocked up!`
				});
			}
		};
	}

};
