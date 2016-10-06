process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;
process.env.APP = "user";

// HACK
import "core-js/fn/object/values";

import path from "path";
import winston from "winston";
import "./configs/winston";
import hbs from "express-hbs";
import express from "./utils/express";
import cookieParser from "cookie-parser";
import session from "./auth/session";
import login from "./auth/oauth";
import handlebars from "./configs/handlebars";


const app = express();
app.engine("hbs", hbs.express4({
	handlebars,
	// partialsDir: path.join(__dirname, "partials"),
	layoutsDir: path.join(__dirname, "views", "layouts"),
	defaultLayout: path.join(__dirname, "views", "layouts", "layout.hbs")
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());

session(app);
login(app);


["cors", "pre", "main", "public", "private", "404", "error.html"].forEach(name => {
	require(`./routes/${name}.js`).default(app, __dirname, "/");
});

const listener = app.listen(process.env.PORT, () => {
	winston.info(`Express server listening on port ${listener.address().port}`);
});

process.on("uncaughtException", winston.error);

export default app;
