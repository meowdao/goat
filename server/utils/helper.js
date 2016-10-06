import winston from "winston";
import {makeError} from "./messenger";
import {translate} from "./lang";


function _send(request, response) {
	return (error) => {
		response.status(error.status).send({
			status: error.status,
			errors: [].concat(error.message)
		});
	};
}

export function processValidationError(error) {
	return Object.keys(error.errors).map(key => error.errors[key].reason || error.errors[key].message);
}

export function processMongoError(error, user) {
	const key = `mongo.${error.message.match(/\$(\S+)/)[1]}`;
	const translation = translate(key, user);
	return translation === key ? translate("mongo.E11000", user) : translation;
}

export function sendError(error, request, response, next) {
	winston.error("->", error);
	void next; // eslint
	const send = _send(request, response);

	if (error.name === "ValidationError") {
		return send({
			status: 409,
			message: processValidationError(error)
		});
	}

	if (error.name === "MongoError" && error.code === 11000) {
		return send({
			status: 400,
			message: processMongoError(error, request.user)
		});
	}

	if (!error.status) {
		if (process.env.NODE_ENV === "production") {
			return send(makeError("server.error", request.user, 500));
		} else {
			return send({
				status: 500,
				message: error.stack
			});
		}
	}

	return send(error);
}

export function wrapJSON(method) {
	return (request, response, next) => {
		method(request, response, next)
			.then(::response.json)
			.catch(error =>
				sendError(error, request, response)
			)
			.done();
	};
}

export function wrapFile(method) {
	return (request, response, next) => {
		method(request, response, next)
			.catch(error =>
				sendError(error, request, response)
			)
			.done();
	};
}
