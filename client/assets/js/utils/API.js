"use strict";

import $ from "jquery";
import ServerActionCreators from "../actions/ServerActionCreators.js";
import history from "../utils/history.js";

export default {

	login(data) {
		$.ajax({
			method: "POST",
			url: "/user/login",
			data: data
		})
			.then(response => {
				ServerActionCreators.updateUser(response);
				history.pushState(null, "user/profile");
			});
	},

	logout(data) {
		$.ajax({
			method: "GET",
			url: "/user/logout",
			data: data
		})
			.then(response => {
				ServerActionCreators.updateUser(response);
				history.pushState(null, "/");
			});
	},

	register(data) {
		$.ajax({
			method: "POST",
			url: "/user/register",
			data: data
		})
			.then(response => {
				ServerActionCreators.updateUser(response);
				history.pushState(null, "user/profile");
			});
	},

	sync (data) {
		$.ajax({
			method: "GET",
			url: "/user/sync",
			data: data
		})
			.then(response => {
				ServerActionCreators.updateUser(response);
				history.pushState(null, "user/profile");
			});
	}

};
