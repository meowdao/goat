"use strict";

import crypto from "crypto";
import escapeStringRegexp from "escape-string-regexp";

export function isType(variable, type) {
	return Object.prototype.toString.call(variable) === "[object " + type + "]";
}

export function getRandomString(length = 64, type = 3) {
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
}

export function tpl(template, data) {
	return template.replace(/(\$\{([^\{\}]+)\})/g, ($0, $1, $2) => $2 in data ? data[$2] : "");
}

export function setRegExp(clean, query, fields) {
	fields.forEach(name => {
		if (query[name]) {
			Object.assign(clean, {
				[name]: {
					$regex: "^" + escapeStringRegexp(query[name]) + "$",
					$options: "i"
				}
			});
		}
	});
}
