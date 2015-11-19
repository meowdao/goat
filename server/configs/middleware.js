"use strict";

import messenger from "../utils/messenger.js";


export default function (app) {

	app.use(function (request, response, next) {
		response.set("Access-Control-Allow-Origin", "*");
		response.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.set("Access-Control-Allow-Headers", "Origin,Accept-Charset,Content-Type");
		next();
	});


	app.use(function (request, response, next) {
		if (request.method === "OPTIONS") {
			return response.status(204).send("");
		}
		next();
	});


	app.use(function (request, response, next) {
		if (request.method === "POST" && !request.get("Origin")) {
			return next(messenger.makeError("no-origin", request.user));
		}
		next();
	});

}
