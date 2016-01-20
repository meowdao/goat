"use strict";

import $ from "jquery";


export default {

	login(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/user/login"
			});
	},

	logout(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "/user/logout"
			});
	},

	register(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/user/register"
			});
	},

	forgot(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/user/forgot"
			});
	},

	change(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "/user/change"
			});
	},

	sync(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "/user/sync"
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
			});
	},

	searchTwits(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "/twitter/search"
			});
	}

};
