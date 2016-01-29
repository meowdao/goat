"use strict";

import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "../configs/mongoose.js";
import configs from "../configs/config.js";


export default function (app) {
	const config = configs[process.env.NODE_ENV];
	const connection = mongoose();

	app.use(session(Object.assign({}, config.session, {
		store: new (connectMongo(session))({mongooseConnection: connection.main})
	})));
}
