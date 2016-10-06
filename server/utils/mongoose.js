import q from "q";
import fs from "fs";
import path from "path";
import winston from "winston";
import mongoose from "mongoose";
import configs from "../configs/config";
import {toTitleCase} from "./misc";


// mongoose.set("debug", true);
mongoose.Promise = q.Promise;
const connections = {};

export function getConnections() {
	const config = configs[process.env.NODE_ENV];
	connections[process.env.NODE_ENV] = connections[process.env.NODE_ENV] || {};

	Object.keys(config.mongo).forEach(name => {
		if (connections[process.env.NODE_ENV][name] && connections[process.env.NODE_ENV][name].readyState) {
			return;
		}

		let db = mongoose.createConnection();

		db.on("close", () => {
			winston.info("connection closed");
		});
		db.on("connected", () => {
			winston.info("MongoDB connected!");
		});
		db.on("connecting", () => {
			winston.info("connecting to MongoDB @ %s", config.mongo[name].url);
		});
		db.on("disconnected", () => {
			winston.info("MongoDB disconnected!");
			db = db.open(config.mongo[name].url, config.mongo[name].options);
		});
		db.on("disconnecting", () => {
			winston.info("disconnecting from MongoDB...");
		});
		db.on("error", error => {
			winston.info("Error in MongoDb connection");
			winston.info(error);
			db.close();
		});
		db.once("fullsetup", () => {
			winston.info("All nodes are connected.");
		});
		db.once("open", () => {
			winston.info("Connected to mongo server.");
		});
		db.on("reconnected", () => {
			winston.info("MongoDB reconnected!");
		});

		db.open(config.mongo[name].url, Object.assign({}, config.mongo[name].options, {promiseLibrary: q}));

		fs.readdirSync(path.join(__dirname, "../models", name)).forEach(file => {
			db.model(toTitleCase(file), require(path.join(__dirname, "../models", name, file)).default);
		});

		connections[process.env.NODE_ENV][name] = db;
	});

	return connections[process.env.NODE_ENV];
}

export function getNewId() {
	return mongoose.Types.ObjectId(); // eslint-disable-line new-cap
}

export function arrayGetter(array) {
	return [...array]; // enchanted array
}
