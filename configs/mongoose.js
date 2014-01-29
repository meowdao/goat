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

    function toTitleCase (str) {
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

    return mongoose;

}
;