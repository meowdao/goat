"use strict";

import Dispatcher from "../dispatcher/dispatcher.js";
import {ActionTypes} from "../constants/constants.js";


export default {

	adminLogin(admin) {
		Dispatcher.dispatch({
			actionType: ActionTypes.ADMIN_LOGIN,
			admin: admin
		});
	},

	adminLogout(admin) {
		Dispatcher.dispatch({
			actionType: ActionTypes.ADMIN_LOGOUT,
			admin: admin
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
			actionType: ActionTypes.ADMIN_LOGIN,
			admin: admin
		});
	}

};
