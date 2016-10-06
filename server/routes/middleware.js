import {makeError} from "../utils/error";


export default function (app) {
	app.use((request, response, next) => {
		response.set("Access-Control-Allow-Origin", "*");
		response.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.set("Access-Control-Allow-Headers", "Origin,Content-Type,X-XSRF-TOKEN,X-Requested-With,X-ABL-Date,X-ABL-Signature,X-ABL-Access-Key,Idempotency-Key");
		next();
	});

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

	app.use((request, response, next) => {
		if (request.method === "POST" || request.method === "PUT") {
			if ((request.get("Content-Type") || "").toLowerCase().replace(" ", "") !== "application/json;charset=utf-8") {
				next(makeError("server.content-type", request.user, 415));
				return;
			}
		}
		next();
	});
}
