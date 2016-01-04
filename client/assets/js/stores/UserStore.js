"use strict";

import {ActionTypes} from "../constants/constants.js";
import BaseStore from "./BaseStore.js";
// import history from "../utils/history.js";

class UserStore extends BaseStore {

	_user = null;

	constructor() {
		super();
		this.subscribe(() => this._registerToActions.bind(this));
	}

	_registerToActions(action) {
		switch (action.actionType) {

		case ActionTypes.UPDATE_USER:
			this._user = action.user;
			this.emitChange();
			break;

		default:
			// do nothing
		}
	}

	getCurrent() {
		return this._user;
	}

	isLoggedIn() {
		return !!this._user;
	}
}

export default new UserStore();
