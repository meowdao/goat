"use strict";

import $ from "jquery";
import ServerActionCreators from "../actions/ServerActionCreators.js";


export default {

	login(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/user/login"
			})
			.then(response => {
				ServerActionCreators.updateUser(response);
			});
	},

	logout(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "/user/logout"
			})
			.then(() => {
				ServerActionCreators.updateUser(null);
			});
	},

	register(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/user/register"
			})
			.then(response => {
				ServerActionCreators.updateUser(response);
			});
	},

	forgot(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/user/forgot"
			})
			.then(response => {
				ServerActionCreators.message(response.message);
			});
	},

	change(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/user/change"
			})
			.then(response => {
				ServerActionCreators.message(response.message);
			});
	},

	sync(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "/user/sync"
			})
			.then(response => {
				ServerActionCreators.updateUser(response);
			});
	},

	categoryList(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "/categories"
			})
			.then(response => response.items);
	},

	categoryNew(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/category"
			})
			.then(response => {
				ServerActionCreators.updateUser(response);
			});
	},

	searchTwits(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "/twitter/search"
			})
			.then(response => {
				ServerActionCreators.updateTwits(response);
			});
	}

};
