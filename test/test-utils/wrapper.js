import {getRandomString} from "../../server/utils/misc";


export function wrapRequest(data) {
	return Object.assign({
		user: null,
		session: {},
		params: {},
		query: {},
		body: {},
		headers: {
			"Idempotency-Key": getRandomString(16)
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
		isAuthenticated() {
			return true;
		},
		login(user, callback) {
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
