export default function (app) {
	app.use((request, response, next) => {
		if (request.method === "OPTIONS") {
			response.status(204).send("");
			return;
		}
		next();
	});

	app.use((request, response, next) => {
		Object.assign(request, {
			params: request.params || {},
			query: request.query || {},
			body: request.body || {}
		});
		next();
	});

	/*
	app.use((request, response, next) => {
		if (request.method === "POST" || request.method === "PUT") {
			if (!request.get("Origin")) {
				return next(messenger.makeError("no-origin", request.user));
			}
		}
		next();
	});
	*/
}
