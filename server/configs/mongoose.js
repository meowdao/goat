"use strict";

import q from "q";
import fs from "fs";
import debug from "debug";
import mongoose from "mongoose";
import configs from "../configs/config.js";
import path from "path";


export default function() {

	const config = configs[process.env.NODE_ENV];
	const log = debug("log:mongoose");
	const db = mongoose.connection;

	mongoose.Promise = q.Promise;

	if (db.readyState) {
		return mongoose;
	}

	db.on("close", () => {
		log("connection closed");
	});
	db.on("connected", () => {
		log("MongoDB connected!");
	});
	db.on("connecting", () => {
		log("connecting to MongoDB @ " + config.mongo.url);
	});
	db.on("disconnected", () => {
		log("MongoDB disconnected!");
		mongoose.connect(config.mongo.url, config.mongo.options);
	});
	db.on("disconnecting", () => {
		log("disconnecting from MongoDB...");
	});
	db.on("error", error => {
		log("Error in MongoDb connection");
		log(error);
		mongoose.disconnect();
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

	mongoose.connect(config.mongo.url, config.mongo.options);

	function toTitleCase(str) {
		return str.split(".")[0].replace(/(^|-)(\w)/g, (all, $1, $2) => {
			return $2.toUpperCase();
		});
	}

	fs.readdirSync(path.join(__dirname, "../models")).forEach(file => {
		mongoose.model(toTitleCase(file), require(path.join(__dirname, "../models", file)).default);
	});

	return mongoose;

}
