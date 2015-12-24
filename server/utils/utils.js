"use strict";

import crypto from "crypto";


export default {

	isType(variable, type) {
		return Object.prototype.toString.call(variable) === "[object " + type + "]";
	},

	getType(variable) {
		return Object.prototype.toString.call(variable).match(/\s([^\]]+)/)[1];
	},

	roughSizeOfObject(object) {
		const objectList = [];
		const stack = [object];
		let bytes = 0;
		let value;

		while (stack.length) {
			value = stack.pop();
			if (typeof value === "boolean") {
				bytes += 4;
			} else if (typeof value === "string") {
				bytes += value.length * 2;
			} else if (typeof value === "number") {
				bytes += 8;
			} else if (typeof value === "object" && objectList.indexOf(value) === -1) {
				objectList.push(value);
				for (let i in value) {
					stack.push(value[i]);
				}
			}
		}
		return bytes;
	},

	getRandomString(length = 64, type = 3) {
		const chars = [
			"0123456789",
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
		];
		const randomBytes = crypto.randomBytes(length);
		const result = new Array(length);
		let cursor = 0;
		for (let i = 0; i < length; i++) {
			cursor += randomBytes[i];
			result[i] = chars[type][cursor % chars[type].length];
		}
		return result.join("");
	},

	tpl(template, data) {
		return template.replace(/(\$\{([^\{\}]+)\})/g, ($0, $1, $2) => $2 in data ? data[$2] : "");
	}

};
