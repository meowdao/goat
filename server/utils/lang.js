"use strict";

const langusges = {
	en: require("../utils/lang/en").default
};

export default {

	getDefaultLanguage() {
		return "en";
	},

	getLanguage(user) {
		return langusges[user && user.language || this.getDefaultLanguage()];
	},

	getObject(parts, obj, create = false) {

		let p;

		if (!Array.isArray(parts)) {
			parts = parts.split("/"); // eslint-disable-line no-param-reassign
		}

		while (obj && parts.length) {
			p = parts.shift();
			if (obj[p] === undefined && create) {
				obj[p] = {};
			}
			obj = obj[p]; // eslint-disable-line no-param-reassign
		}

		return obj;
	},

	translate(key, user) {
		return this.getObject(key, this.getLanguage(user));
	}

};
