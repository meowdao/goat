"use strict";

import _ from "lodash";
import cuid from "cuid";
import {ActionTypes} from "../constants/constants.js";
import BaseStore from "./BaseStore.js";


class MessageStore extends BaseStore {

	_messages = [];

	constructor() {
		super();
		this.subscribe(() => this._registerToActions.bind(this));
	}

	_registerToActions(action) {
		switch (action.actionType) {

			case ActionTypes.ERROR:
				action.messages.forEach(message => {
					this._messages.push({
						id: cuid(),
						type: "danger",
						text: message
					});
				});
				this.emitChange();
				break;

			case ActionTypes.MESSAGE:
				action.messages.forEach(message => {
					this._messages.push({
						id: cuid(),
						type: "success",
						text: message
					});
				});
				this.emitChange();
				break;

			default:
				// do nothing
				break;
		}
	}

	remove(id) {
		var index = _.findIndex(this._messages, message => message.id === id);
		this._messages.splice(index, 1);
		this.emitChange();
	}

	getMessages() {
		return this._messages;
	}

}

export default new MessageStore();

