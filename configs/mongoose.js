"use strict";

var mongoose = require("mongoose");

module.exports = function (config) {

    mongoose.connect(config.mongoUrl);

    mongoose.connection.on("open", function () {
        console.log("Connected to mongo server.");
    });

    mongoose.connection.on("error", function (error) {
        console.log("Could not connect to mongo server!");
        console.error(error);
    });

	// mongoose.connection.db.adminCommand({setParameter: 1, textSearchEnabled: true});

    // Models
    require("../models/user.js");
};