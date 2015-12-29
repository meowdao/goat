"use strict";

import Dispatcher from "../dispatcher/dispatcher.js";
import {ActionTypes} from "../constants/constants.js";


export default {

	adminLogin(admin) {
		Dispatcher.dispatch({
			admin,
			actionType: ActionTypes.ADMIN_LOGIN
		});
	},

	adminLogout(admin) {
		Dispatcher.dispatch({
			admin,
			actionType: ActionTypes.ADMIN_LOGOUT
		});
	},

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

	updateUser(admin) {
		Dispatcher.dispatch({
			admin,
			actionType: ActionTypes.ADMIN_LOGIN
		});
	}

};
