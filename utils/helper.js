"use strict";

import _ from "lodash";
import debug from "debug";
import lang from "../utils/lang.js";
import messager from "../utils/messager.js";

var log = debug("server:helper");

export default {

	simpleJSONWrapper: function (method) {
		return function (request, response, next) {
			method(request, response, next)
				.then(response.json.bind(response))
				.fail((error) => {
					log(error);
					throw error;
				})
				.fail(function (error) {
					// error instanceof mongoose.Error.ValidationError
					if (error.name === "ValidationError") {
						error = {
							status: 409,
							message: _.pluck(error.errors, "message")
						};
					}
					if (!error.status) {
						error = messager.makeError("server-error", request.user);
					}
					response.status(error.status).send({
						error: error.status,
						errors: [error.message]
					});
				})
				.done();
		};
	}
};
