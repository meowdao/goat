import bluebird from "bluebird";
import winston from "winston";
import * as mocks from "./mocks";
import {getConnections} from "../server/shared/utils/mongoose";
import {processValidationError} from "../server/shared/utils/error";


export function setUp(chain) {
	const results = {};
	let promise = bluebird.resolve(results);

	while (chain.length) {
		const next = chain.shift();
		promise = promise.then(() =>  // eslint-disable-line no-loop-func
			mocks[`create${next.model}`](next.requires, next.data || new Array(next.count).fill({}), results)
				.then(result => {
					results[next.model] = result;
					return results;
				})
		);
	}

	return promise
		.catch(error => {
			if (error.name === "ValidationError") {
				winston.error(processValidationError(error));
			}
			throw error;
		});
}

export function cleanUp(models = []) {
	const connections = getConnections();
	return bluebird.all([].concat(...Object.keys(connections).map(connection =>
		Object.keys(connections[connection].models)
			.filter(key => !models.includes(key))
			.map(key => connections[connection].models[key].remove()))
	));
}

export function tearDown() {
	return cleanUp([]);
}

