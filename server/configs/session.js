import session from "express-session";
import connectRedis from "connect-redis";
import connectMongo from "connect-mongo";
import {getConnections} from "../utils/mongoose";
import redis from "./redis";
import configs from "./config";


export default function (app) {
	const config = configs[process.env.NODE_ENV];
	const connections = getConnections();

	app.use(session(Object.assign({}, config.session, {
		store: config.session.store === "mongo" ?
			new (connectMongo(session))({mongooseConnection: connections.auth}) :
			new (connectRedis(session))(Object.assign(config.redis, {client: redis()}))
	})));
}

