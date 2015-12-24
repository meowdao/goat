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

	/* eslint-disable no-unused-vars */
	sendError(error, request, response, next) {
		log("sendError", error.message, error.stack);
		if (error.name === "ValidationError") {
			error = {
				code: 409,
				message: Object.keys(error.errors).map(key => error.errors[key].message)
			};
		}
		if (error.name === "MongoError" && error.code === 11000) {
			const key = error.message.match(/\$(\w+)\s+/)[1];
			error = {
				code: 400,
				message: lang.translate("error/mongo/" + key, request.user) || lang.translate("error/mongo/E11000", request.user)
			};
		}
		if (!error.code) {
			if (process.env.NODE_ENV === "production") {
				error = messenger.makeError("server-error", request.user, 500);
			} else {
				error.code = 500;
				error.message = error.stack;
			}
		}
		response.status(error.code).send({
			status: error.code,
			errors: [].concat(error.message)
		});
	}
	/* eslint-enable no-unused-vars */
};
