"use strict";

var path = require("path");

var rootPath = path.normalize(__dirname + "/..");
var templatesPath = path.join(rootPath, "views");

module.exports = {
    development: {
        port: 8888,
        mongoUrl: "",
        smtp: {
            secureConnection: true,
            host: "",
            port: 465,
            auth: {
                user: "",
                pass: ""
            }
        },
        mail: {
            serverHost: "",
            general: {
                from: "",
                to: ""
            }
        },
        templatesPath: templatesPath,
        facebook: {
            clientID: "",
            clientSecret: "",
            callbackURL: ""
        },
        google: {
            clientID: "",
            clientSecret: "",
            callbackURL: ""
        }
    }
};