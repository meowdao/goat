import crypto from "crypto";
import configs from "../configs/config";
import {getObject} from "./lang";


export function getRandomElementFromArray(array = []) {
	return array[Math.floor(Math.random() * array.length)];
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

export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function toDollars(amount) {
	return `$${(amount && amount / 100 || 0).toFixed(2)}`;
}

export function toTitleCase(str) {
	return str.split(".")[0].replace(/(^|-)(\w)/g, (all, $1, $2) => $2.toUpperCase());
}

export function getType(variable) {
	return Object.prototype.toString.call(variable); // .match(/\[object (\w+)\]/i)[1]
}

export function isType(variable, type) {
	return getType(variable) === `[object ${type}]`;
}

export function formatUrl({protocol, hostname, port}) {
	// url.format puts port 80 which we don't need
	return `${protocol}://${hostname}${port === "80" ? "" : `:${port}`}`;
}

export function getServerUrl(env = process.env.NODE_ENV) {
	return formatUrl(configs[env].server);
}

export function tpl(template = "???", data = {}) {
	return template.replace(/(\$\{([^\{\}]+)\})/g, ($0, $1, $2) => getObject($2, data));
}
