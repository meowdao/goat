"use strict";

//import crypto from "crypto";
import Q from "q";
import helper from "../utils/helper.js";
import messager from "../utils/messager.js";

export default function (app) {

	/*
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
		next(messager.makeError("no-origin", request.get("Origin")));
	});

	app.use(function (request, response, next) {
		next(messager.makeError("not-acceptable", response.get("Accept-Charset").toLowerCase() === "utf-8"));
	});

	app.use(function (request, response, next) {
		next(messager.makeError("content-type", response.get("Content-Type").toLowerCase() === "json"));
	});

	app.use(function(request, response, next) {
		response.cookie("XSRF-TOKEN", request.csrfToken());
		next();
	});
	*/

	require("./routes.js")(app);

	app.use(function (request, response, next) {
		next(messager.makeError("page-not-found", true));
	});

	app.use(function (error, request, response, next) {
		helper.printStackTrace(error, true);

		if (error.name === "ValidationError") {
			error.status = 409;
		}

		if (!error.status) {
			error = messager.makeError("server-error", request.user);
		}

		response.status(error.status);

		helper.simpleHTMLWrapper(function message (request) {
			helper.messages(request, "errors", error.message);
			return Q({
				back: request.headers.referer
			});
		})(request, response, next);

	});

	/* jshint unused: false */
	// next is needed by express
	/*
	app.use(function (error, request, response, next) {
		helper.printStackTrace(error, true);
		if (!error.status) {
			error = messager.makeError("server-error", true);
		}
		response.status(200).json(error);

	});
	*/
	/* jshint unused: true */

	/* jshint unused: false */
	// next is needed by express
	app.use(function (error, request, response, next) {
		helper.printStackTrace(error, true);
		response.status(500).send(messager.makeError("server-error", request.user));
	});
	/* jshint unused: true */

}