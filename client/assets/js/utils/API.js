"use strict";

import $ from "jquery";
import ServerActionCreators from "../actions/ServerActionCreators";
import RouteActionCreators from "../actions/RouteActionCreators.js";


export default {

	login(data) {

		$.ajax({
			method: "POST",
			url: "/user/login",
			data: data
		})
			.then(response => {
				ServerActionCreators.updateUser(response);
				RouteActionCreators.transitionTo("user/profile");
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
				RouteActionCreators.transitionTo("profile");
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
				RouteActionCreators.transitionTo("profile");
			});
	}

};
