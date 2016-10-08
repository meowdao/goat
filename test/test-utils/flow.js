import q from "q";
import winston from "winston";
import async from "async";
import * as mocks from "./mocks";
import {getConnections} from "../../server/utils/mongoose";
import {processValidationError} from "../../server/utils/error";


export function setUp(chain) {
	const results = {};
	let promise = q(results);

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
	return q.all([].concat(...Object.keys(connections).map(connection => Object.keys(connections[connection].models)
		.filter(key => !models.includes(key))
		.map(key => connections[connection].models[key].find()))))
		.then(result =>
			q.denodeify(async.eachLimit)([].concat(...result), 1, async.asyncify(model => model.remove()))
		);
}

export function tearDown() {
	return cleanUp(["Category", "MailLayout", "MailTemplate", "SmsTemplate"]);
}

