"use strict";

import {makeError} from "../utils/messenger.js";


export default function (app) {
	app.use((request, response, next) => {
		response.set("Access-Control-Allow-Origin", "*");
		response.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.set("Access-Control-Allow-Headers", "Origin,Accept-Charset,Content-Type");
		next();
	});

	app.use((request, response, next) => {
		if (request.method === "OPTIONS") {
			return response.status(204).send("");
		}
		next();
	});

	app.use((request, response, next) => {
		if (request.method === "POST" && !request.get("Origin")) {
			return next(makeError("no-origin", request.user));
		}
		next();
	});
}
