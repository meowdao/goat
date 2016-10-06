import {makeError} from "../utils/error";


export default function (app) {
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
