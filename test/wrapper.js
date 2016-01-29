"use strict";


export function wrapRequest(data) {
	return Object.assign({
		user: null,
		session: {},
		params: {},
		query: {},
		body: {},
		headers: {
		},
		route: {
			path: "/"
		},
		set(key, value) {
			this.headers[key] = value;
		},
		get(key) {
			return this.headers[key];
		},
		param(key) {
			return this.params[key] || this.body[key] || this.query[key];
		},
		logIn(user, callback) {
			callback();
		},
		logout() {
		}
	}, data);
}

export function wrapResponse(data) {
	return Object.assign({
		headers: {},
		redirect() {
		},
		set(name, value) {
			this.headers[name] = value;
		},
		clearCookie() {
		}
	}, data);
}