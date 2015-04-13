"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;

import fs from "fs";
import path from "path";
import debug from "debug";

import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import React from "react";
import Html from "./assets/js/components/Html";
import app from "./configs/express.js";


var log = debug("server:webpack");

const statsJsonPath = path.join(__dirname, "build", "_stats.json");

function renderApp(request, webpackAssets) {
    const html = React.renderToStaticMarkup(<Html webpackAssets={webpackAssets}/>);
    request.send(`<!doctype html>\n${html}`);
}

if (process.env.NODE_ENV === "production") {

    app.use("/build", express.static(path.join(__dirname, "build")));

    app.get("/", function (request, response) {
        renderApp(response, JSON.parse(fs.readFileSync(statsJsonPath)));
    });

} else {

    const webpackServer = new WebpackDevServer(webpack(require("./configs/webpack")), {
        publicPath: "http://0.0.0.0:3001/build/",
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

    webpackServer.listen(3001, "0.0.0.0", function (err, result) {
        if (err) {
            console.error(err.stack);
        } else {
            log("Webpack server listening on port 3001");
        }
    });

    app.get("/", function (request, response) {
        renderApp(response, JSON.parse(webpackServer.middleware.fileSystem.readFileSync(statsJsonPath)));
    });

}

require("./configs/middleware.js")(app);
require("./configs/routes.js")(app);
require("./configs/error.js")(app);

app.listen(process.env.PORT, function () {
	log("Express server listening on port " + process.env.PORT);
});

process.on("uncaughtException", function (exception) {
	log(exception);
	log(exception.stack);
});


