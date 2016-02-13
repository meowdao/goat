"use strict";

import q from "q";
import fs from "fs";
import path from "path";
import debug from "debug";
import mongoose from "mongoose";


mongoose.Promise = q.Promise;
const connections = {};

function toTitleCase(str) {
	return str.split(".")[0].replace(/(^|-)(\w)/g, (all, $1, $2) => {
		return $2.toUpperCase();
	});
}

export default function (config) {
	const log = debug("log:mongoose");

	Object.keys(config.mongo).forEach(name => {
		if (connections[name] && connections[name].readyState) {
			return;
		}

		let db = mongoose.createConnection();

		db.on("close", () => {
			log("connection closed");
		});
		db.on("connected", () => {
			log("MongoDB connected!");
		});
		db.on("connecting", () => {
			log("connecting to MongoDB @ " + config.mongo[name].url);
		});
		db.on("disconnected", () => {
			log("MongoDB disconnected!");
			db = db.open(config.mongo[name].url, config.mongo[name].options);
		});
		db.on("disconnecting", () => {
			log("disconnecting from MongoDB...");
		});
		db.on("error", error => {
			log("Error in MongoDb connection");
			log(error);
			db.close();
		});
		db.once("fullsetup", () => {
			log("All nodes are connected.");
		});
		db.once("open", () => {
			log("Connected to mongo server.");
		});
		db.on("reconnected", () => {
			log("MongoDB reconnected!");
		});

		db.open(config.mongo[name].url, config.mongo[name].options);

		fs.readdirSync(path.join(__dirname, "../models", name)).forEach(file => {
			db.model(toTitleCase(file), require(path.join(__dirname, "../models", name, file)).default);
		});

		connections[name] = db;
	});

	return connections;
}
