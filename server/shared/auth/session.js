import {Router} from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import connectMongo from "connect-mongo";
import redis from "./redis";
import configs from "../../shared/configs/config";
import {getConnections} from "../utils/mongoose";


const router = Router(); // eslint-disable-line new-cap

const config = configs[process.env.NODE_ENV];
const connections = getConnections();

router.use(session(Object.assign({}, config.session, {
	store: config.session.store === "mongo"
		? new (connectMongo(session))({mongooseConnection: connections.office})
		: new (connectRedis(session))(Object.assign(config.redis, {client: redis()}))
})));

export default router;

