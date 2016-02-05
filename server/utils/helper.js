"use strict";

import debug from "debug";
import {makeError} from "../utils/messenger.js";
import {translate} from "../utils/lang.js";

const log = debug("utils:response");

function _send(request, response) {
	return (error) => {
		response.status(error.code).send({
			code: error.code,
			errors: [].concat(error.message)
		});
	};
}

export function sendError(error, request, response, next) {
	log("sendError", error);
	void next; // eslint
	const send = _send(request, response);
	if (error.name === "ValidationError") {
		return send({
			code: 409,
			message: Object.keys(error.errors).map(key => error.errors[key].message)
		});
	}
	if (error.name === "MongoError" && error.code === 11000) {
		const key = error.message.match(/\$(\S+)/)[1];
		return send({
			code: 400,
			message: translate("error/mongo/" + key, request.user) || translate("error/mongo/E11000", request.user)
		});
	}
	if (error.type === "StripeCardError" || error.type === "StripeInvalidRequest") {
		return send({
			code: 400,
			message: error.message
		});
	}
	if (!error.code) {
		if (process.env.NODE_ENV === "production") {
			return send(makeError("server-error", request.user, 500));
		} else {
			return send({
				code: 500,
				message: error.stack
			});
		}
	}
	return send(error);
}

export function wrapJSON(method) {
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

export function wrapFile(method) {
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
