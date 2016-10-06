import path from "path";
import {Router} from "express";
import {renderPage} from "../utils/render";

export default function (app, dirname, prefix) {
	const router = Router(); // eslint-disable-line new-cap

	router.get("/", renderPage);

	router.get("/ping", (request, response) => {
		response.status(200).json({pong: true});
	});

	router.get("/favicon.ico", (request, response) => {
		response.sendFile(path.join(dirname, "../client/assets/img/favicon.ico"));
	});

	app.use(prefix, router);
}
