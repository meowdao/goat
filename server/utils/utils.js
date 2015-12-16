"use strict";

import fs from "fs";
import path from "path";
import crypto from "crypto";

export default {

	getPath (...args) {
		return path.join(__dirname, "..", ...args);
	},

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

	getObject (parts, create, obj) {

		if (typeof parts === "string") {
			parts = parts.split(".");
		}

		if (typeof create !== "boolean") {
			obj = create;
			create = undefined;
		}

		var p;

		while (obj && parts.length) {
			p = parts.shift();
			if (obj[p] === undefined && create) {
				obj[p] = {};
			}
			obj = obj[p];
		}

		return obj;
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
	},

	setStatus(clean, query, obj) {
		switch (query.status) {
			case "all":
				break;
			case "inactive":
				clean.status = obj.constructor.statuses.inactive;
				break;
			case "active":
			default:
				clean.status = obj.constructor.statuses.active;
				break;
		}
	},

	setRegExp(clean, query, fields){
		fields.forEach(name => {
			if (query[name]) {
				clean[name] = {
					$regex: "^" + query[name].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),
					$options: "i"
				};
			}
		});
	},

	getControllers(...args) {
		let controllers = {};
		fs.readdirSync(this.getPath("controllers")).forEach(file => {
			if (fs.statSync(this.getPath("controllers", file)).isFile()) {
				const name = file.split(".")[0].replace(/-/g, "");
				controllers[name] = new (require(this.getPath("controllers", file)).default)(...args);
			}
		});
		return controllers;
	}
};
