"use strict";

import debug from "debug";
import messager from "../utils/messager.js";

let log = debug("log:helper");

export default {

	simpleJSONWrapper (method) {
		return (request, response, next) => {
			method(request, response, next)
				.then(response.json.bind(response))
				.fail(error => {
					this.sendError(error, request, response);
				})
				.done();
		};
	},

	sendError(error, request, response, next){
		log(error);
		if (error.name === "ValidationError") {
			error = {
				status: 409,
				message: Object.keys(error.errors).map(key => error.errors[key].message)
			};
		}
		if (!error.status) {
			error = messager.makeError("server-error", request.user);
		}
		response.status(error.status).send({
			status: error.status,
			errors: [].concat(error.message)
		});
	}
};
