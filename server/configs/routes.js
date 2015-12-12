"use strict";

import fs from "fs";
import messenger from "../utils/messenger.js";
import utils from "../utils/utils.js";


export default function (app) {

	function createRegExpParameter(re) {
		return function (request, response, next, val, name) {
			var captures;
			if (captures = re.exec(String(val))) {
				request.params[name] = captures;
				next();
			} else {
				next(messenger.makeError("invalid-param", request.user));
			}
		};
	}

	app.param("_id", createRegExpParameter(/^[0-9a-z]{24}$/));

	fs.readdirSync(utils.getPath("routes")).forEach(file => {
		require(utils.getPath("routes", file)).default(app);
	});

}