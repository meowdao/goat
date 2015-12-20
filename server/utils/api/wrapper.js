"use strict";

import Q from "q";

export default {

	callback (func) {
		return function (...args) {
			if (process.env[this.key] === "true") {
				func.bind(this)(...args);
			} else {
				process.nextTick(() => {
					args[0](); // done
				});
			}
		};
	},

	promise (func) {
		return function (...args) {
			if (process.env[this.key] === "true") {
				return func.bind(this)(...args);
			} else {
				return Q({
					success: false,
					message: `process.env.${this.key} != true, method is mocked up!`
				});
			}
		};
	}

};
