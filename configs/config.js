"use strict";

var path = require("path");

var rootPath = path.normalize(__dirname + "/..");
var templatesPath = path.join(rootPath, "views");

module.exports = {
    development: {
        port: 8888,
        mongoUrl: "mongodb://mathgames:ldJeXSReLeRwjJ@mathgames.m0.mongolayer.com:27017,mongodb://mathgames:ldJeXSReLeRwjJ@mathgames.m1.mongolayer.com:27017/mathgames-staging",
        smtp: {
            secureConnection: true,
            host: "email-smtp.us-east-1.amazonaws.com",
            port: 465,
            auth: {
                user: "AKIAJMG7SNNAQXB5HTYA",
                pass: "AgvfU/hfgKW9YAtok2tZPeQ6kAv9b4O5ZbaGg0iiMjG5"
            }
        },
        mail: {
            serverHost: "localhost:8888",
            general: {
                from: "ctapbiumabp@gmail.com",
                to: "ctapbiumabp@gmail.com"
            }
        },
        templatesPath: templatesPath,
        facebook: {
            clientID: "192062784288246",
            clientSecret: "33f7dea30135ee45ce3b8cb62efe1f0f",
            callbackURL: "http://www.mathgames.com/auth/facebook/callback"
        },
        google: {
            clientID: "451759059572.apps.googleusercontent.com",
            clientSecret: "6I3MjJS1AWDOOsMQy6joeasg",
            callbackURL: "http://www.mathgames.com/auth/google/callback"
        }
    }
};