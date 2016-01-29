"use strict";

import q from "q";
import debug from "debug";
import * as mocks from "./mocks";
import {getControllers} from "./controllers";


const log = debug("test-utils:flow");
const controllers = getControllers(false);

export function mockInChain(chain) {
	const results = {};
	let promise = q(results);

	while (chain.length) {
		const next = chain.shift();
		promise = promise.then(() => { // eslint-disable-line no-loop-func
			return mocks["create" + next.model].bind(controllers)(next.requires, next.data || new Array(next.count).fill({}), results)
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

export function cleanUp() {
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
		}));
}
