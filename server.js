"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;

import fs from "fs";
import http from "http";
import path from "path";
import debug from "debug";
import React from "react";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import Html from "./assets/js/components/Html";
import express from "./configs/express.js";


if (process.env.NODE_ENV !== "production") {
	debug.enable("log:*");
	debug.enable("controller:*");
	debug.enable("web:*");
}

var log = debug("log:server");
var app = express();

const webpackServer = new WebpackDevServer(webpack(require("./configs/webpack")), {
	publicPath: "http://0.0.0.0:3001/",
	watchDelay: 0,
	hot: true,
	stats: {
		colors: true,
		assets: true,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false,
		children: false
	}
});

webpackServer.listen(3001, "0.0.0.0", function (error) {
	log(error || "Webpack server listening on port 3001");
});

app.use(csrf());
app.use((request, response, next) => {
	log("XSRF-TOKEN", request.csrfToken());
	response.cookie("XSRF-TOKEN", request.csrfToken());
	next();
});

app.get("/", function (request, response) {
	const statsJsonPath = path.join(__dirname, "build", "_stats.json");
	const webpackAssets = JSON.parse(webpackServer.middleware.fileSystem.readFileSync(statsJsonPath));
	const html = React.renderToStaticMarkup(<Html webpackAssets={webpackAssets}/>);
	response.send(`<!doctype html>\n${html}`);
});

require("./configs/middleware.js")(app);
require("./configs/routes.js")(app);
require("./configs/error.js")(app);

app.listen(process.env.PORT, function () {
	log("Express server listening on port " + process.env.PORT);
});

process.on("uncaughtException", function (exception) {
	log(exception);
});
