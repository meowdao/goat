"use strict";

import path from "path";
import crypto from "crypto";


export default {

	isType (variable, type) {
		return Object.prototype.toString.call(variable) === "[object " + type + "]";
	},

	getType (variable) {
		return Object.prototype.toString.call(variable).match(/\s([^\]]+)/)[1];
	},

	roughSizeOfObject (object) {

		var objectList = [],
			stack = [object],
			bytes = 0;

		while (stack.length) {
			var value = stack.pop();
			if (typeof value === "boolean") {
				bytes += 4;
			} else if (typeof value === "string") {
				bytes += value.length * 2;
			} else if (typeof value === "number") {
				bytes += 8;
			} else if (typeof value === "object" && objectList.indexOf(value) === -1) {
				objectList.push(value);
				for (var i in value) {
					stack.push(value[i]);
				}
			}
		}
		return bytes;
	},

	getRandomString(length = 64, type = 3){
		let chars = [
			"0123456789",
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
		];
		let randomBytes = crypto.randomBytes(length);
		let result = new Array(length);
		let cursor = 0;
		for (var i = 0; i < length; i++) {
			cursor += randomBytes[i];
			result[i] = chars[type][cursor % chars[type].length];
		}
		return result.join("");
	},

	tpl(template, data) {
		return template.replace(/(\$\{([^\{\}]+)\})/g, ($0, $1, $2) => $2 in data ? data[$2] : "");
	}

};
