"use strict";

import path from "path";

export default function (app) {
	app.get("/api/v1/ping", (request, response) => {
		response.status(200).json({pong: true});
	});

	app.get("/favicon.ico", (request, response) => {
		response.sendFile(path.join(__dirname, "../../client/assets/img/favicon.ico"));
	});
}
