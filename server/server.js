"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;

import debug from "debug";
import express from "./configs/express.js";


if (process.env.NODE_ENV !== "production") {
	debug.enable("log:*");
	debug.enable("controller:*");
	debug.enable("model:*");
}

const log = debug("log:server");
const app = express();

require("./configs/middleware.js").default(app);
require("./configs/routes.js").default(app);
require("./configs/static.js").default(app);

app.listen(process.env.PORT, () => {
	log("Express server listening on port " + process.env.PORT);
});

process.on("uncaughtException", (exception) => {
	log(exception);
});
