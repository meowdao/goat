"use strict";

import {ActionTypes} from "../constants/constants.js";
import BaseStore from "./BaseStore.js";


class UserStore extends BaseStore {

	_users = [];

	constructor() {
		super();
		this.subscribe(() => this._registerToActions.bind(this));
	}

	_registerToActions(action) {
		switch (action.actionType) {

		case ActionTypes.UPDATE_USER_LIST:
			this._users = action.users;
			this.emitChange();
			break;

		default:
			// do nothing
		}
	}

	getUsers() {
		return this._users;
	}

}

export default new UserStore();
