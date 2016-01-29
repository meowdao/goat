"use strict";

import fs from "fs";
import {makeError} from "../utils/messenger.js";
import path from "path";


export default function(app) {

	function createRegExpParameter(re) {
		return (request, response, next, val, name) => {
			const captures = re.exec(String(val));
			if (captures) {
				request.params[name] = captures;
				next();
			} else {
				next(makeError("invalid-param", request.user));
			}
		};
	}

	app.param("_id", createRegExpParameter(/^[0-9a-z]{24}$/));

	fs.readdirSync(path.join(__dirname, "../routes")).forEach(file => {
		require(path.join(__dirname, "../routes", file)).default(app);
	});

}
