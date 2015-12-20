"use strict";

//import $ from "../utils/jquery.js";
//import history from "../utils/history.js";
import ServerActionCreators from "../actions/ServerActionCreators.js";


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

	forgot(data) {
		$.ajax({
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
		$.ajax({
				method: "POST",
				url: "/user/change",
				data: data
			})
			.then(response => {
				ServerActionCreators.updateUser(response);
				history.pushState(null, "/");
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
