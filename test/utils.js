"use strict";

import q from "q";
import _ from "lodash";
import fs from "fs";
import path from "path";
import debug from "debug";
import {isType} from "../server/utils/utils.js";
import {password, confirm, firstName, lastName, email} from "../server/utils/constants/misc.js";


export function getControllers(...args) {
	const controllers = {};
	fs.readdirSync(path.join(__dirname, "../server/controllers")).forEach(file => {
		if (fs.statSync(path.join(__dirname, "../server/controllers", file)).isFile()) {
			const name = file.split(".")[0].replace(/-/g, "");
			const Controller = require(path.join(__dirname, "../server/controllers", file)).default;
			controllers[name] = new Controller(...args);
		}
	});
	return controllers;
}

export function populate(requires, data, results, makeDefaults) {
	return _.times(data.length, i => {
		const result = {};
		Object.keys(requires || {}).forEach(model => {
			if (isType(requires[model], "String")) {
				if (requires[model] === "o2o") {
					result[model] = results[model][i];
				} else if (requires[model] === "m2o") {
					result[model] = results[model][0];
				} else if (requires[model] === "o2m" || requires[model] === "m2m") {
					result[model] = results[model];
				} else {
					result[model] = [];
				}
			} else if (isType(requires[model], "Array")) {
				if (isType(requires[model][i], "Array")) {
					result[model] = results[model].filter((item, j) => requires[model][i].indexOf(j) !== -1);
				} else if (isType(requires[model][i], "Number")) {
					result[model] = results[model][requires[model][i]];
				} else {
					result[model] = null;
				}
			} else if (isType(requires[model], "Function")) {
				result[model] = results[model].filter(requires[model](model, i));
			} else {
				result[model] = [];
			}
		});

		return makeDefaults(data[i], result, i);
	});
}

const controllers = getControllers(false);
const log = debug("log:helper");

export function createUser() {
	return controllers.user.create(populate(...arguments, (user, nested, i) =>
			Object.assign({
				password,
				confirm,
				firstName,
				lastName,
				email: email + i,
				companyName: "Company_" + i,
				domainName: "domain.com" + i,
				phoneNumber: "1234567890" + i
			}, user)))
		.then(users => {
			// log("users", users);
			return users;
		});
}

export function cleanUp(done) {
	return q.all(Object.keys(controllers)
		.map(name => {
			if (name === "user") {
				return controllers[name].find({}, {lean: false})
					.then(users => q.allSettled(users.map(user => controllers[name].destroy(user))));
			} else if ("remove" in controllers[name]) {
				return controllers[name].remove();
			} else {
				return q();
			}
		}))
		.finally(done)
		.done();
}

export function mockInChain(chain) {
	const results = {};
	let promise = q(results);

	while (chain.length) {
		const next = chain.shift();
		promise = promise.then(() => { // eslint-disable-line no-loop-func
			return module.exports["create" + next.model](next.requires, next.data || new Array(next.count).fill({}), results)
				.then(result => {
					results[next.model] = result;
					return results;
				});
		});
	}

	return promise
		.catch(error => {
			if (error.name === "ValidationError") {
				log(Object.keys(error.errors).map(key => error.errors[key].message));
			}
			throw error;
		});
}

export function wrapRequest(data) {
	return Object.assign({
		user: null,
		params: {},
		query: {},
		body: {},
		headers: {},
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
		redirect() {
		},
		set() {
		},
		clearCookie() {
		}
	}, data);
}
