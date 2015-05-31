"use strict";

import express from "express";
import connectMongo from "connect-mongo";
import debug from "debug";

// middleware
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";


// configs
import Q from "./q.js";

import session from "./session.js";
import passport from "./passport.js";


export default function () {

	void(Q);

	let app = express();

	app.disable("x-powered-by");

	app.use(logger("dev")); // "default", "short", "tiny", "dev"
	app.use(cookieParser("keyboardcat"));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	session(app);
	passport(app);

	return app;

}
