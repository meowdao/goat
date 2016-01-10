"use strict";

import debug from "debug";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import server from "./server"; // eslint-disable-line no-unused-vars

const log = debug("log:server");

// http://webpack.github.io/docs/webpack-dev-server.html#combining-with-an-existing-server
const webpackServer = new WebpackDevServer(webpack(require("./configs/webpack")), {
	publicPath: "/build/",
	contentBase: "/client/build/",
	filename: "bundle.js",
	watchOptions: {
		aggregateTimeout: 0
	},
	hot: true,
	inline: true,
	stats: {
		colors: true,
		assets: true,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false,
		children: false
	},
	proxy: [{
		path: /favicon\.ico/,
		target: "http://localhost:3001/build/"
	}, {
		path: /^(?!.*\.hot-update\.js)(.*)$/,
		target: "http://localhost:3000/"
	}]
});

webpackServer.listen(3001, "0.0.0.0", (error) => {
	log(error || "Webpack server listening on port 3001");
});
