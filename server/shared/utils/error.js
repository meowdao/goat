export function makeError(message, status = 400, data = {}) {
	return Object.assign(new Error(), {message, status, ...data});
}

export function processValidationError(error) {
	return Object.keys(error.errors).map(key => ({
		name: error.errors[key].path,
		message: "invalid-param",
		reason: error.errors[key].reason ? error.errors[key].reason.message : error.errors[key].message
	}));
}

export function processMongoError(error) {
	const key = error.message.match(/index: (\S+)/)[1];
	return [{
		name: key.split("-")[0],
		reason: key.split("-")[1],
		message: "conflict"
	}];
}

