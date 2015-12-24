"use strict";

import $ from "jquery";
import ServerActionCreators from "../actions/ServerActionCreators.js";


export default {

	login(data) {
		return $.ajax({
			method: "POST",
			url: "/user/login",
			data: data
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
		});
	},

	logout(data) {
		return $.ajax({
			method: "GET",
			url: "/user/logout",
			data: data
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
		});
	},

	register(data) {
		return $.ajax({
			method: "POST",
			url: "/user/register",
			data: data
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
			history.pushState(null, "user/profile");
		});
	},

	forgot(data) {
		return $.ajax({
			method: "POST",
			url: "/user/forgot",
			data: data
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
			history.pushState(null, "/");
		});
	},

	change(data) {
		return $.ajax({
			method: "POST",
			url: "/user/change",
			data: data
		})
		.then(response => {
			ServerActionCreators.updateUser(response);
			history.pushState(null, "/");
		});
	},

	sync(data) {
		return $.ajax({
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
