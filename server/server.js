"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;

import debug from "debug";
import app from "./configs/express.js";
import webpack from "webpack";

const log = debug("log:server");

debug.enable("log:*");
debug.enable("controller:*");
debug.enable("model:*");
debug.enable("server:*");

if (process.env.NODE_ENV !== "production") {

	const config = require("./configs/webpack");
	const compiler = webpack(config);
	const webpackdev = require("./configs/webpack.dev");

	app.use(require('webpack-dev-middleware')(compiler, webpackdev));
	app.use(require('webpack-hot-middleware')(compiler));

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


