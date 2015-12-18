"use strict";

import API from "../utils/API.js";


export default {

	login (data) {
		API.login(data);
	},

	logout (data){
		API.logout(data);
	},

	register(data) {
		API.register(data);
	},

	sync(data) {
		API.sync(data);
	},

	forgot(data) {
		API.forgot(data);
	},

	change(data) {
		API.forgot(data);
	}

};
