"use strict";

var mongoose = require("mongoose");

module.exports = function (config) {

    var db = mongoose.connection;

    if (db.readyState) {
        return mongoose;
    }

    db.on("connecting", function () {
        console.log("connecting to MongoDB...");
    });

    db.on("error", function (error) {
        console.error("Error in MongoDb connection");
        console.error(error);
        mongoose.disconnect();
    });

    db.on("connected", function () {
        console.log("MongoDB connected!");
    });

    db.once("open", function () {
        console.log("Connected to mongo server.");
    });

    db.on("reconnected", function () {
        console.log("MongoDB reconnected!");
    });

    db.on("disconnected", function () {
        console.log("MongoDB disconnected!");
        mongoose.connect(config.mongoUrl, {server: {auto_reconnect: true}});
    });

    mongoose.connect(config.mongoUrl, {server: {auto_reconnect: true}});


	// mongoose.connection.db.adminCommand({setParameter: 1, textSearchEnabled: true});

    // Models
    require("../models/user.js");
};