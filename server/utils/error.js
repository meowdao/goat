import {translate} from "./lang";
import {tpl} from "./misc";


function _makeError(text, code = 500) {
	const error = new Error();
	error.message = text;
	error.status = code;
	return error;
}

export function makeError(key, user, code = 400, data = {}) {
	return _makeError(tpl(translate(key, user), data), code);
}

export function processValidationError(error) {
	return Object.keys(error.errors).map(key => error.errors[key].reason || error.errors[key].message);
}

export function processMongoError(error, user) {
	const key = `mongo.${error.message.match(/\$(\S+)/)[1]}`;
	const translation = translate(key, user);
	return translation === key ? translate("mongo.E11000", user) : translation;
}

export function processStripeError(error, user) {
	switch (error.type) {
		case "StripeCardError":
		case "StripeInvalidRequestError":
			return error.message;
		case "StripeAPIError":
		case "StripeConnectionError":
		case "StripeAuthenticationError":
		default:
			return translate("api.stripe-bad-request", user);
	}
}
