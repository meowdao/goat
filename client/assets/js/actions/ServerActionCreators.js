"use strict";

import Dispatcher from "../dispatcher/dispatcher.js";
import {ActionTypes} from "../constants/constants.js";


export default {

	adminLogin: function (admin) {
		Dispatcher.dispatch({
			actionType: ActionTypes.ADMIN_LOGIN,
			admin: admin
		});
	},

	adminLogout: function (admin) {
		Dispatcher.dispatch({
			actionType: ActionTypes.ADMIN_LOGOUT,
			admin: admin
		});
	},

	error: function (error) {
		Dispatcher.dispatch({
			actionType: ActionTypes.ERROR,
			messages: [].concat(error)
		});
	},

	message: function (message) {
		Dispatcher.dispatch({
			actionType: ActionTypes.MESSAGE,
			messages: [].concat(message)
		});
	},

	updateUser: function(admin){
		Dispatcher.dispatch({
			actionType: ActionTypes.ADMIN_LOGIN,
			admin: admin
		});
	}

};
