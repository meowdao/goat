"use strict";

import $ from "jquery";
import ServerActionCreators from "../actions/ServerActionCreators.js";


export default {

	login(data) {
		return $.ajax({
			data,
			method: "POST",
			url: "/user/login"
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
		});
	},

	logout(data) {
		return $.ajax({
			data,
			method: "GET",
			url: "/user/logout"
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
		});
	},

	register(data) {
		return $.ajax({
			data,
			method: "POST",
			url: "/user/register"
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
		});
	},

	forgot(data) {
		return $.ajax({
			data,
			method: "POST",
			url: "/user/forgot"
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
		});
	},

	change(data) {
		return $.ajax({
			data,
			method: "POST",
			url: "/user/change"
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
		});
	},

	sync(data) {
		return $.ajax({
			data,
			method: "GET",
			url: "/user/sync"
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
		});
	}

};
