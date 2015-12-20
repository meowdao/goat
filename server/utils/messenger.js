"use strict";

import lang from "./lang.js";


export default {

	_makeError(message, code = 500) {
		let error = new Error();
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

	notActive(controller, user) {
		return model => {
			if (model.status !== controller.constructor.statuses.active) {
				throw this._makeError(this.getText(controller.displayName, "not-active", user, "Is Not Active"), 400);
			} else {
				return model;
			}
		};
	},

	notMine(controller, user){
		return model => {
			if (user._id.toString() !== model.user._id.toString()) {
				throw this.makeError("access-denied", user, 403);
			} else {
				return model;
			}
		};
	},

	getText(displayName, key, user, fallback){
		return lang.translate(`error/server/${displayName}-${key}`, user) || `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} ${fallback}`;
	}
};

