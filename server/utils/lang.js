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

	getObject(parts, create, obj) {

		if (typeof parts === "string") {
			parts = parts.split("/");
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

	translate(key, user) {
		return this.getObject(key, this.getLanguage(user));
	}

};
