import $ from "jquery";

export default {

	login(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "login"
			});
	},

	logout(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "logout"
			});
	},

	register(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "register"
			});
	},

	forgot(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "forgot"
			});
	},

	change(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "change"
			});
	},

	sync(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "user/sync"
			});
	},

	categoryList(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "categories"
			})
			.then(response => response.items);
	},

	categoryNew(data) {
		return $
			.ajax({
				data,
				method: "POST",
				url: "category"
			});
	},

	searchTwits(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "twitter/search"
			});
	},

	searchUsers(data) {
		return $
			.ajax({
				data,
				method: "GET",
				url: "users"
			});
	},

	updateUsers(data) {
		return $
			.ajax({
				data,
				method: "PUT",
				url: `user/${data._id}`
			});
	}

};
