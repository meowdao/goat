import winston from "winston";
import {makeError, processValidationError, processMongoError, processStripeError} from "../utils/error";


function _send(request, response) {
	return error => {
		response.status(error.status).send({
			status: error.status,
			errors: [].concat(error.message)
		});
	};
}

export function sendError(error, request, response, next) {
	//if (process.env.NODE_ENV !== "test") {
		winston.error(error);
	//}
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
			status: 409,
			message: processMongoError(error, request.user)
		});
	}
	if (error.type && error.type.startsWith("Stripe")) {
		return send({
			status: 400,
			message: processStripeError(error, request.user)
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
			.then(result => {
				if (result.success === false) {
					response.status(400);
					return response.json(result);
				}
				if (Array.isArray(result)) {
					return response.json({list: result.map(item => item.toJSON())});
				}
				return response.json("toJSON" in result ? result.toJSON() : result);
			})
			.catch(error => sendError(error, request, response))
			.done();
	};
}

export function wrapFile(method) {
	return (request, response, next) => {
		method(request, response, next)
			.catch(error => sendError(error, request, response))
			.done();
	};
}

export function wrapStripe(method) {
	return (request, response, next) => {
		method(request, response, next)
			.then(response.json.bind(response))
			.catch(error => sendError(error, request, response))
			.done();
	};
}

