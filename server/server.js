"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;

import debug from "debug";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";


import express from "./configs/express.js";
import {renderHTML} from "./utils/render";


if (process.env.NODE_ENV !== "production") {
	debug.enable("log:*");
	debug.enable("controller:*");
	debug.enable("model:*");
	debug.enable("web:*");
}

var log = debug("log:server");
var app = express();

// http://webpack.github.io/docs/webpack-dev-server.html#combining-with-an-existing-server
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
	},
	proxy: {
		"*": "http://localhost:3000"
	}
});

webpackServer.listen(3001, "0.0.0.0", function (error) {
	log(error || "Webpack server listening on port 3001");
});

app.get("/", function (request, response) {
	response.send(renderHTML());
});

require("./configs/middleware.js").default(app);
require("./configs/routes.js").default(app);
require("./configs/static.js").default(app);

app.listen(process.env.PORT, () => {
	log("Express server listening on port " + process.env.PORT);
});

process.on("uncaughtException", (exception) => {
	log(exception);
});
