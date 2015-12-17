"use strict";

import Q from "q";
import _ from "lodash";
import fs from "fs";
import path from "path";
import debug from "debug";
import moment from "moment";
import utils from "../server/utils/utils.js";
import {date} from "../server/utils/constants/date.js";
import {password} from "../server/utils/constants/misc.js";
import configs from "../server/configs/config.js";

const config = configs[process.env.NODE_ENV];

let controllers = getControllers(false);

let log = debug("log:helper");


export function createUser(requires, users, data) {
	return controllers.user.create(populate(requires, users, data, (user, data, i) => Object.assign({
			email: "ctapbiumabp" + i + "@gmail.com",
			password: password,
			confirm: password,
			firstName: "Trej",
			lastName: "Gun",
			companyName: "Company_" + i,
			domainName: "domain.com",
			phoneNumber: "1234567890" + i
		}, user)))
		.then(users => {
			// log("users", users);
			return users;
		});
}


export function populate(requires, parents, children, makeDefaults) {

	return _.times(parents.length, i => {

		let result = {};
		Object.keys(requires || {}).forEach(model => {
			if (utils.isType(requires[model], "String")) {
				if (requires[model] === "o2o") {
					result[model] = children[model][i];
				} else if (requires[model] === "m2o") {
					result[model] = children[model][0];
				} else if (requires[model] === "o2m" || requires[model] === "m2m") {
					result[model] = children[model];
				} else {
					result[model] = [];
				}
			} else if (utils.isType(requires[model], "Array")) {
				if (utils.isType(requires[model][i], "Array")) {
					result[model] = children[model].filter((item, j) => requires[model][i].indexOf(j) !== -1);
				} else if (utils.isType(requires[model][i], "Number")) {
					result[model] = children[model][requires[model][i]];
				} else {
					result[model] = null;
				}
			} else if (utils.isType(requires[model], "Function")) {
				result[model] = children[model].filter(requires[model](model, i));
			} else {
				result[model] = [];
			}
		});

		return makeDefaults(parents[i], result, i);
	});

}

export function cleanUp(done) {
	return Q.all(Object.keys(controllers).map(name => {
			if (name === "user") {
				return controllers[name].find({}, {lean: false})
					.then(users => Q.allSettled(users.map(user => controllers[name].destroy(user))));
			} else if ("remove" in controllers[name]) {
				return controllers[name].remove();
			} else {
				return Q();
			}
		}))
		.finally(done)
		.done();
}

export function mockInChain(chain) {

	let results = {},
		promise = Q(results);

	while (chain.length) {
		promise = (next => promise.then(() => {
			log("next", next);
			return module.exports["create" + next.model](next.requires, next.data || new Array(next.count).fill({}), results)
				.then(result => {
					results[next.model] = result;
					return results;
				});
		}))(chain.shift());
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
		set (key, value) {
			this.headers[key] = value;
		},
		get (key){
			return this.headers[key];
		},
		param (key){
			return this.params[key] || this.body[key] || this.query[key];
		},
		logIn (user, callback) {
			callback();
		},
		logout () {
		}
	}, data);
}

export function wrapResponse(data) {
	return Object.assign({
		redirect () {
		},
		set(){
		},
		clearCookie(){
		}
	}, data);
}


export function getControllers(...args) {
	let controllers = {};
	fs.readdirSync(path.join(__dirname, "../server/controllers")).forEach(file => {
		if (fs.statSync(path.join(__dirname, "../server/controllers", file)).isFile()) {
			const name = file.split(".")[0].replace(/-/g, "");
			controllers[name] = new (require(path.join(__dirname, "../server/controllers", file)).default)(...args);
		}
	});
	return controllers;
}
