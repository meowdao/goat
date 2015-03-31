"use strict";

import express from "express";
import connectMongo from "connect-mongo";

// middleware
import logger from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import serveFavicon from "serve-favicon";
import serveStatic from "serve-static";
import compress from "compression";

// configs
import Q from "./q.js";
import configs from "./config.js";
import mongoose from "./mongoose.js";
import passport from "./passport.js";
import handlebars from "./handlebars.js";

// utils
import utils from "../utils/utils.js";

void(Q); // jshint
var config = configs[process.env.NODE_ENV];
var mongoStore = connectMongo(session);

var app = express();

app.set("port", process.env.PORT || config.port);
app.engine("hbs", handlebars.express3({
	layoutsDir: utils.getPath("views", "site", "layouts"),
	partialsDir: utils.getPath("views", "site", "partials")
}));
app.set("view engine", "hbs");
app.set("views", utils.getPath("views", "site"));

var maxAge = 864e5; // 1 day
if (process.env.NODE_ENV === "development") {
	maxAge = 0;
}

if (process.env.NODE_ENV === "development") {
	app.use(serveStatic("assets", {maxAge: maxAge}));
}
app.use(serveStatic("dist", {maxAge: maxAge}));

app.use(compress());
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
	store: new mongoStore({
		mongooseConnection: mongoose.connection
	})
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(serveFavicon(utils.getPath("/dist/img/favicon.ico")));

app.use(passport.initialize());
app.use(passport.session());

require("./middleware.js")(app);

export default app;
