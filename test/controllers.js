"use strict";

import fs from "fs";
import path from "path";

export function getControllers(...args) {
	const controllers = {};
	fs.readdirSync(path.join(__dirname, "../server/controllers")).forEach(file => {
		if (fs.statSync(path.join(__dirname, "../server/controllers", file)).isFile()) {
			const name = file.split(".")[0].replace(/-/g, "");
			const Controller = require(path.join(__dirname, "../server/controllers", file)).default;
			controllers[name] = new Controller(...args);
		}
	});
	return controllers;
}
