import express from "express";
import logger from "morgan";
import queryType from "query-types";
import bodyParser from "body-parser";


export default function () {
	const app = express();

	app.disable("x-powered-by");

	if (process.env.NODE_ENV !== "test") {
		app.use(logger("dev"));
	}
	app.use(queryType.middleware());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	return app;
}
