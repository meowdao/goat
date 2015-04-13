"use strict";

import express from "express";
import connectMongo from "connect-mongo";
import debug from "debug";

// middleware
import logger from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import csrf from "csurf";


// configs
import Q from "./q.js";
import mongoose from "./mongoose.js";
import passport from "./passport.js";


void(Q); // jshint

var maxAge = 864e5; // 1 day
if (process.env.NODE_ENV === "development") {
	maxAge = 0;
}

if (process.env.NODE_ENV !== "production") {
	debug.enable("server:*");
}

var app = express();

app.disable("x-powered-by");

app.use(logger("dev")); // "default", "short", "tiny", "dev"
app.use(cookieParser("keyboardcat"));
app.use(session({
	secret: "keyboardcat",
	key: "sid",
	resave: false,
	saveUninitialized: true,
	cookie: {
		//domain : ".mydomain.com",
		//path: "/",
		maxAge: 31536e6, // 1 year
		httpOnly: true,
		secure: false
	},
	// express/mongo session storage
	store: new (connectMongo(session))({
		mongooseConnection: mongoose.connection
	})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(csrf());
app.use(function (request, response, next) {
	response.cookie("XSRF-TOKEN", request.csrfToken());
	next();
});

export default app;
