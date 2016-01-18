"use strict";

import _ from "lodash";
import cuid from "cuid";
import {ActionTypes} from "../constants/constants.js";
import BaseStore from "./BaseStore.js";


class TwitterStore extends BaseStore {

	_messages = [];

	constructor() {
		super();
		this.subscribe(() => this._registerToActions.bind(this));
	}

	_registerToActions(action) {
		switch (action.actionType) {

			case ActionTypes.UPDATE_TWITTER:
				this._messages = action.data.statuses;

				this.emitChange();
				break;

			default:
				// do nothing
				break;
		}
	}

	getMessages() {
		return this._messages;
	}

}

export default new TwitterStore();
