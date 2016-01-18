"use strict";

import Dispatcher from "../dispatcher/dispatcher.js";
import {ActionTypes} from "../constants/constants.js";


export default {

	error(error) {
		Dispatcher.dispatch({
			actionType: ActionTypes.ERROR,
			messages: [].concat(error)
		});
	},

	message(message) {
		Dispatcher.dispatch({
			actionType: ActionTypes.MESSAGE,
			messages: [].concat(message)
		});
	},

	updateUser(user) {
		Dispatcher.dispatch({
			user,
			actionType: ActionTypes.UPDATE_USER
		});
	},

	updateTwits(data) {
		Dispatcher.dispatch({
			data,
			actionType: ActionTypes.UPDATE_TWITTER
		});
	}

};
