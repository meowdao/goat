import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "./session";
import passport from "./passport";
import proxy from "./proxy";


export default function () {
	const app = express();

	if (process.env.NODE_ENV === "production") {
		app.use("/build", express.static("./client/build"));
	}

	app.disable("x-powered-by");

	app.use(logger("dev")); // "default", "short", "tiny", "dev"
	app.use(cookieParser("keyboardcat"));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	session(app);
	passport(app);
	proxy(app);

	return app;
}
