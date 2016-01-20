"use strict";

import debug from "debug";
import {makeError} from "../utils/messenger.js";
import lang from "../utils/lang.js";

const log = debug("log:helper");

export function sendError(error, request, response, next) {
	log("sendError", error);
	if (error.name === "ValidationError") {
		error = {
			status: 409,
			message: Object.keys(error.errors).map(key => error.errors[key].message)
		};
	}
	if (error.name === "MongoError" && error.code === 11000) {
		const key = error.message.match(/\$(\S+)/)[1];
		error = {
			status: 400,
			message: lang.translate("error/mongo/" + key, request.user) || lang.translate("error/mongo/E11000", request.user)
		};
	}
	if (error.type === "StripeCardError" || error.type === "StripeInvalidRequest") {
		error.status = 400;
	}
	if (!error.status) {
		if (process.env.NODE_ENV === "production") {
			error = makeError("server-error", request.user, 500);
		} else {
			error.status = 500;
			error.message = error.stack;
		}
	}
	response.status(error.status).send({
		status: error.status,
		errors: [].concat(error.message)
	});
}

export function simpleJSONWrapper(method) {
	return (request, response, next) => {
		method(request, response, next)
			.then(result => {
				if (result.success === false) {
					response.status(400);
				}
				response.json(result);
			})
			.catch(error => {
				log(error);
				return sendError(error, request, response);
			})
			.done();
	};
}

export function simpleFileWrapper(method) {
	return (request, response, next) => {
		method(request, response, next)
			.then(result => {
				log("result", result);
			})
			.catch(error => {
				log(error);
				return sendError(error, request, response);
			})
			.done();
	};
}
