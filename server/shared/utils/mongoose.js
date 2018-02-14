import bluebird from "bluebird";
import fs from "fs";
import path from "path";
import winston from "winston";
import mongoose from "mongoose";
import config from "../configs/mongo";
import {toTitleCase} from "./misc";
import globalOptions from "../models/plugins/options.global";


// mongoose.set("debug", true);
mongoose.Promise = bluebird.Promise;
mongoose.plugin(globalOptions);

let connections = {};

export function getConnections() {
	connections = connections || {};

	Object.keys(config).forEach(name => {
		if (connections[name] && connections[name].readyState) {
			return;
		}

		const db = mongoose.createConnection(config[name].url, Object.assign({}, config[name].options, {promiseLibrary: bluebird}));

		db.on("close", () => {
			winston.info("connection closed");
		});
		db.on("connected", () => {
			winston.info("MongoDB connected!");
		});
		db.on("connecting", () => {
			winston.info("connecting to MongoDB @ %s", config[name].url);
		});
		db.on("disconnected", () => {
			winston.info("MongoDB disconnected!");
		});
		db.on("disconnecting", () => {
			winston.info("disconnecting from MongoDB...");
		});
		db.on("error", error => {
			winston.info("Error in MongoDb connection");
			winston.info(error);
			db.close();
		});
		db.on("fullsetup", () => {
			winston.info("All nodes are connected.");
		});
		db.on("open", () => {
			winston.info("Connected to mongo server.");
		});
		db.on("reconnected", () => {
			winston.info("MongoDB reconnected!");
		});

		fs.readdirSync(path.join(__dirname, "../../", name, "models")).forEach(file => {
			db.model(toTitleCase(file), require(path.join(__dirname, "../../", name, "models", file)).default);
		});

		connections[name] = db;
	});

	return connections;
}

export function closeConnections() {
	return bluebird.all(Object.keys(connections).map(name => connections[name].close()))
}

export function getNewId() {
	return mongoose.Types.ObjectId(); // eslint-disable-line new-cap
}

export function arrayGetter(array) {
	return [...array]; // enchanted array
}
