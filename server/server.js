"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;

import debug from "debug";
import express from "./configs/express.js";
import webpack from "webpack";

debug.enable("log:*");
if (process.env.GOAT_DEBUG === "true") {
	debug.enable("controller:*");
	debug.enable("model:*");
	debug.enable("server:*");
}

const log = debug("log:server");
const app = express();

if (process.env.NODE_ENV !== "production") {
	const config = require("./configs/webpack");
	const compiler = webpack(config);
	const webpackdev = require("./configs/webpack.dev");

	app.use(require("webpack-dev-middleware")(compiler, webpackdev));
	app.use(require("webpack-hot-middleware")(compiler));
}


require("./configs/middleware.js").default(app);
require("./configs/routes.js").default(app);
require("./configs/static.js").default(app);

app.listen(process.env.PORT, () => {
	log("Express server listening on port " + process.env.PORT);
});

process.on("uncaughtException", (exception) => {
	log(exception);
});
