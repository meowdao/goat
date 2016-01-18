"use strict";

import lang from "./lang.js";
import {date} from "./constants/date.js";


export default {
	_makeError(message, code = 500) {
		const error = new Error();
		error.message = message;
		error.code = code;
		return error;
	},

	makeError(key, user, code = 400) {
		return this._makeError(lang.translate("error/server/" + key, user), code);
	},

	notFound(controller, user) {
		return model => {
			if (!model) {
				throw this._makeError(this.getText(controller.displayName, "not-found", user, "Not Found"), 404);
			} else {
				return model;
			}
		};
	},

	notMine(controller, user) {
		return model => {
			if (user._id.toString() !== model.user._id.toString()) {
				throw this.makeError("access-denied", user, 403);
			} else {
				return model;
			}
		};
	},

	isActive(isAllowed = false, context = null) {
		const messenger = this;
		return function(model, request) {
			const controller = context || this;
			const isAdmin = !request.user.role === "admin";
			const isActive = model.status === controller.constructor.statuses.active;
			if (!isActive && !(isAllowed && isAdmin)) {
				throw messenger._makeError(messenger.getText(controller.displayName, "not-active", request.user, "Is Not Active"), 400);
			} else {
				return model;
			}
		};
	},

	isPast(isAllowed = false, field = "startTime") {
		const messenger = this;
		return function(model, request) {
			const isAdmin = !request.user.role === "admin";
			const isPast = model[field] <= date; // <= for tests
			if (isPast && !(isAllowed && isAdmin)) {
				throw messenger.makeError("event-has-passed", request.user);
			}
		};
	},

	getText(displayName, key, user, fallback) {
		return lang.translate(`error/server/${displayName}-${key}`, user) || `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} ${fallback}`;
	}
};
