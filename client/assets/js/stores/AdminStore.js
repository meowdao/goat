"use strict";

import {ActionTypes} from "../constants/constants.js";
import BaseStore from "./BaseStore.js";
//import history from "../utils/history.js";

class AdminStore extends BaseStore {

	_admin = null;

	constructor() {
		super();
		this.subscribe(() => this._registerToActions.bind(this));
	}

	_registerToActions(action) {
		switch(action.actionType) {

			case ActionTypes.ADMIN_LOGIN:
				this._admin = action.admin;
				this.emitChange();
				//history.pushState(null, "dashboard");
				break;

			case ActionTypes.ADMIN_LOGOUT:
				this._admin = null;
				this.emitChange();
				//history.pushState(null, "/");
				break;

			default:
			// do nothing
		}
	}

	getCurrent() {
		return this._admin;
	}

	isLoggedIn() {
		return !!this._admin;
	}
}

export default new AdminStore();
