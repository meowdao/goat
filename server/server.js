"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;

import fs from "fs";
import http from "http";
import path from "path";
import debug from "debug";
import React from "react";
import ReactDOM from "react-dom/server";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";


import Html from "../client/assets/js/components/Html";
import express from "./configs/express.js";


if (process.env.NODE_ENV !== "production") {
	debug.enable("log:*");
	debug.enable("controller:*");
	debug.enable("model:*");
	debug.enable("web:*");
}

var log = debug("log:server");
var app = express();

const webpackServer = new WebpackDevServer(webpack(require("./configs/webpack")), {
	publicPath: "/assets/",
	watchOptions: {
		aggregateTimeout: 0
	},
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

app.get("/", function (request, response) {
	const html = ReactDOM.renderToStaticMarkup(<Html/>);
	response.send(`<!doctype html>\n${html}`);
});

require("./configs/middleware.js").default(app);
require("./configs/routes.js").default(app);
require("./configs/error.js").default(app);

app.listen(process.env.PORT, () => {
	log("Express server listening on port " + process.env.PORT);
});

process.on("uncaughtException", (exception) => {
	log(exception);
});
