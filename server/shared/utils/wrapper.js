import winston from "winston";
import {makeError, processValidationError, processMongoError} from "./error";
import {clearJSON} from "./response";


function _send(request, response) {
	return (status, errors) =>
		response.status(status).send({status, errors});
}

export function sendError(error, request, response, next) { // eslint-disable-line no-unused-vars
	if (process.env.NODE_ENV !== "test") {
		winston.error(error);
	}
	const send = _send(request, response);
	if (error.name === "ValidationError") {
		return send(400, processValidationError(error));
	}
	if (error.name === "MongoError" && error.code === 11000) {
		return send(409, processMongoError(error));
	}
	if (error.status === 403 && error.code === "EBADCSRFTOKEN") {
		return send(403, [makeError("csrf-token", 403)]);
	}
	if (!error.status) {
		if (process.env.NODE_ENV === "production") {
			return send(500, [makeError("server-error", 500)]);
		} else {
			return send(500, [new Error(error.stack)]);
		}
	}
	return send(error.status, [error]);
}


export function wrapJSON(method) {
	return (request, response, next) =>
		method(request, response, next)
			.then(result => {
				if (result === null) {
					return response.json(null);
				}
				if (Array.isArray(result.list)) {
					return response.json({
						count: result.count,
						list: result.list.map(clearJSON)
					});
				}
				return response.json(clearJSON(result));
			})
			.catch(error => sendError(error, request, response));
}

export function wrapFile(method) {
	return (request, response, next) =>
		method(request, response, next)
			.catch(error => sendError(error, request, response));
}

export function wrapStripe(method) {
	return (request, response, next) =>
		method(request, response, next)
			.then(::response.json)
			.catch(error => sendError(error, request, response));
}

