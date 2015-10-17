"use strict";

import _ from "lodash";
import messager from "../utils/messager.js";


export default {

	requiresParams  (required) {
		return (request, response, next) => {
			var query = request.method === "POST" || request.method === "PUT" ? request.body : request.query;
			if (!_.every(required, function (e) {
					return !!query[e];
				})) {
				return next(messager.makeError("no-param"));
			}
			return next();
		};
	},

	requiresRole (required, self) {
		return (request, response, next) => {
			this.requiresLogin(request, response, function () {
				if (!_.contains(required, request.user.role) || !(self && request.user._id.toString() === request.params.id)) {
					return next(messager.makeError("access-denied"));
				}
				return next();
			});
		};
	},

	requiresLogin () {
		return (request, response, next) => {
			if (!request.isAuthenticated()) {
				request.session.originalUrl = request.originalUrl;
				return response.redirect("/user/login");
			}
			return next();
		};
	},

	methodNotAllowed (request, response, next) {
		return next(messager.makeError("method-not-allowed", request.user));
	}

}
