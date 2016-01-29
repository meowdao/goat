"use strict";

import fs from "fs";
import path from "path";

const root = __dirname.split("node_modules")[0]; // hack :(

export function getControllers(...args) {
	const controllers = {};
	fs.readdirSync(path.join(root, "server/controllers")).forEach(file => {
		if (fs.statSync(path.join(root, "server/controllers", file)).isFile()) {
			const name = file.split(".")[0].replace(/-/g, "");
			const Controller = require(path.join(root, "server/controllers", file)).default;
			controllers[name] = new Controller(...args);
		}
	});
	return controllers;
}
