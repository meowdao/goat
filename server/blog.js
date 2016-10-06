process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 9000;
process.env.APP = "blog";

// HACK
import "core-js/fn/object/values";

import winston from "winston";
import "./configs/winston";
import cookieParser from "cookie-parser";
import express from "./utils/express";
import login from "./auth/strategies";
import session from "./auth/session";
import proxy from "./utils/proxy";
import webpack from "webpack";


const app = express();
app.use(cookieParser());

session(app);
proxy(app);
login(app);

if (process.env.NODE_ENV !== "production") {
	const config = require("./configs/webpack");
	const compiler = webpack(config);
	const webpackdev = require("./configs/webpack.dev");

	app.use(require("webpack-dev-middleware")(compiler, webpackdev));
	app.use(require("webpack-hot-middleware")(compiler));
}


["cors", "pre", "json", "main", "login", "csrf", "private", "static"].forEach(name => {
	require(`./routes/${name}.js`).default(app, __dirname, "/api/");
});

const listener = app.listen(process.env.PORT, () => {
	winston.info(`Express server listening on port ${listener.address().port}`);
});

process.on("uncaughtException", winston.error);

export default app;
