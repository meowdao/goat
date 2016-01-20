"use strict";

import crypto from "crypto";

export function isType(variable, type) {
	return Object.prototype.toString.call(variable) === "[object " + type + "]";
}

export function getType(variable) {
	return Object.prototype.toString.call(variable).match(/\s([^\]]+)/)[1];
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
