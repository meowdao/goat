"use strict";

import debug from "debug";
import messenger from "../utils/messenger.js";
import lang from "../utils/lang.js";

const log = debug("log:helper");

export default {

	simpleJSONWrapper(method) {
		return (request, response, next) => {
			method(request, response, next)
				.then(response.json.bind(response))
				.catch(error => {
					this.sendError(error, request, response);
				})
				.done();
		};
	},

	simpleFileWrapper(method) {
		return (request, response, next) => {
			method(request, response, next)
				.then(result => {
					log("result", result);
				})
				.catch(error => {
					return this.sendError(error, request, response);
				})
				.done();
		};
	},

	sendError(err, request, response) {
		let error = err;
		log("sendError", error.message, error.stack);
		if (error.name === "ValidationError") {
			error = messenger._makeError(Object.keys(error.errors).map(key => error.errors[key].message), 409);
		}
		if (error.name === "MongoError" && error.code === 11000) {
			const key = error.message.match(/\$(\w+)\s+/)[1];
			error = messenger._makeError(lang.translate("error/mongo/" + key, request.user) || lang.translate("error/mongo/E11000", request.user), 400);
		}
		if (!error.code) {
			if (process.env.NODE_ENV === "production") {
				error = messenger.makeError("server-error", request.user, 500);
			} else {
				error = messenger._makeError(error.stack, 500);
			}
		}
		response.status(error.code).send({
			code: error.code,
			errors: [].concat(error.message)
		});
	}
};
