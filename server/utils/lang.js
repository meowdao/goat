import fs from "fs";
import path from "path";

const bundle = "../lang";

const languages = {};

if (!getAvailableLanguages().length) {
	fs.readdirSync(path.join(__dirname, bundle)).forEach(lang => {
		languages[lang] = {};
		fs.readdirSync(path.join(__dirname, bundle, lang)).forEach(file => {
			languages[lang][file.slice(0, -5)] = require(path.join(__dirname, bundle, lang, file));
		});
	});
}

export function getAvailableLanguages() {
	return Object.keys(languages);
}

export function getDefaultLanguage() {
	return "en";
}

export function getLanguage(user) {
	return languages[user && user.lang || getDefaultLanguage()];
}

export function getObject(path, obj = {}, delimiter = ".") {
	const paths = path.split(delimiter);
	let current = obj;

	for (let i = 0; i < paths.length; ++i) {
		if (current[paths[i]] === void 0) {
			return path;
		} else {
			current = current[paths[i]];
		}
	}
	return current;
}

export function translate(path, user) {
	return getObject(path, getLanguage(user));
}

