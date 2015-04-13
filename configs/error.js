"use strict";

//import crypto from "crypto";
import Q from "q";
import debug from "debug";
import helper from "../utils/helper.js";
import messager from "../utils/messager.js";

var log = debug("server:error");

export default function (app) {

	app.use(function (request, response, next) {
		next(messager.makeError("page-not-found", true));
	});

	/* jshint unused: false */
	// next is needed by express
	app.use(function (error, request, response, next) {
		log(error.stack || "No stack trace available :(");
		log(error);

		if (error.name === "ValidationError") {
			error.status = 409;
		}
		if (!error.status) {
			error = messager.makeError("server-error", request.user);
		}
		response.status(error.status).json(error);

	});
	/* jshint unused: true */

}