"use strict";

import mongoose from "mongoose";
import configs from "../configs/config.js";

var config = configs[process.env.NODE_ENV];

var db = mongoose.connection;

// http://mongodb.github.io/node-mongodb-native/api-generated/replset.html
// http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html
var options = {
	/*db: {
		//readPreference: "secondary",
		//native_parser: true
	},*/
	server: {
		//readPreference: "secondary",
		//socketOptions: {
		//    keepAlive: 1
		//},
		auto_reconnect: true,
		poolSize: 10
	}//,
	/*replset: {
		readPreference: "secondary",
		socketOptions: {
			keepAlive: 1
		},
		ha: true,
		strategy: "ping"
	},*/
	/*mongos: {
		socketOptions: {
			keepAlive: 1
		},
		ha: true
	}*/
};

if (db.readyState) {
	return mongoose;
}

// events: close, connected, connecting, disconnected, disconnecting, error, fullsetup, open, reconnected

db.on("close", function () {
	console.log("connection closed");
});
db.on("connected", function () {
	console.log("MongoDB connected!");
});
db.on("connecting", function () {
	console.log("connecting to MongoDB...");
});
db.on("disconnected", function () {
	console.log("MongoDB disconnected!");
	mongoose.connect(config.mongoUrl, options);
});
db.on("disconnecting", function () {
	console.log("connecting from MongoDB...");
});
db.on("error", function (error) {
	console.error("Error in MongoDb connection");
	console.error(error);
	mongoose.disconnect();
});
db.once("fullsetup", function () {
	console.log("All nodes are connected.");
});
db.once("open", function () {
	console.log("Connected to mongo server.");
});
db.on("reconnected", function () {
	console.log("MongoDB reconnected!");
});

mongoose.connect(config.mongoUrl, options);

//https://github.com/LearnBoost/mongoose/issues/1401
//http://stackoverflow.com/questions/15990787/mongo-db-text-search-with-mongoose
//http://docs.mongodb.org/manual/tutorial/enable-text-search/
//mongoose.connection.db.adminCommand({setParameter: 1, textSearchEnabled: true});

function toTitleCase(str) {
	return str.replace(/(^|_)(\w)/g, function (all, $1, $2) {
		return $2.toUpperCase();
	});
}

// Models
var models = [
	"avatar",
	"hash",
	"opt_out",
	"user"
];

models.forEach(function (model) {
	mongoose.model(toTitleCase(model), require("../models/" + model + ".js"));
});

export default mongoose;

