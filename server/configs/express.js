"use strict";

import express from "express";

// middleware
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";


// configs
import session from "./session.js";
import passport from "./passport.js";
import proxy from "./proxy.js";

export default function () {

	let app = express();

	if (process.env.NODE_ENV == "production") {
		app.use("/build", express.static("./client/build"));
	}

	app.disable("x-powered-by");

	app.use(logger("dev")); // "default", "short", "tiny", "dev"
	app.use(cookieParser("keyboardcat"));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	proxy(app);
	session(app);
	passport(app);


	return app;
}
