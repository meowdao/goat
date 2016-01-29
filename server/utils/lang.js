"use strict";

const languages = {
	en: require("./lang/en")
};


export function getAvailableLanguages() {
	return ["en"];
}

export function getDefaultLanguage() {
	return "en";
}

export function getLanguage(user) {
	return languages[user && user.language || getDefaultLanguage()];
}

export function getObject(path, obj) {
	const paths = path.split("/");
	let current = obj;

	for (let i = 0; i < paths.length; ++i) {
		if (current[paths[i]] === void 0) {
			return void 0;
		} else {
			current = current[paths[i]];
		}
	}
	return current;
}

export function translate(path, user) {
	return getObject(path, getLanguage(user));
}
