"use strict";

import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "../configs/mongoose.js";
import configs from "../configs/config.js";


const config = configs[process.env.NODE_ENV];

export default function(app) {

	const mongoClient = mongoose();

	app.use(session(Object.assign({}, config.session, {
		store: new (connectMongo(session))({mongooseConnection: mongoClient.connection})
	})));

}
