"use strict";

var path = require("path");

var rootPath = path.normalize(__dirname + "/..");
var templatesPath = path.join(rootPath, "views");

module.exports = {
    development: {
        port: 8888,
        mongoUrl: "mongodb://localhost:27017/goat",
        templatesPath: templatesPath
    }
};