"use strict";

var express = require("express"),
    consolidate = require("consolidate"),
    mongoose = require("mongoose"),
    mongoStore = require("connect-mongo")(express);

module.exports = function (config, app, passport) {

    app.set("port", process.env.PORT || config.port);
    app.set("view engine", "html");
    app.set("views", config.templatesPath);
    app.set("jsonp callback", true);
    app.engine("html", consolidate.underscore);

    var maxAge = 864e5; //one day
    if (process.env.NODE_ENV === "development") {
        maxAge = 0;
    }

    app.use(express.static("dist", {maxAge: maxAge}));

    app.use(express.compress());
    app.use(express.logger("dev")); // "default", "short", "tiny", "dev"
    app.use(express.cookieParser("keyboardcat"));
    app.use(express.session({
        secret: "keyboardcat",
        cookie: {
            //domain : ".mydomain.com",
            //path: "/",
            maxAge: 31536e6, // 1 year
            httpOnly: true,
            secure: false
        },
        // express/mongo session storage
        store: new mongoStore({
            db: mongoose.connection.db,
            collection: "sessions",
            interval: 12e4  // 2 hours
        })
    }));
    app.use(express.bodyParser());
    app.use(express.favicon());
    app.use(express.methodOverride());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);

    app.use(function (request, response) {
        response.status(404);
        response.render("404.html", {url: request.url});
    });

    if (process.env.NODE_ENV === "development") {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    } else {
        /* jshint unused: false */
        // next is needed by express
        app.use(function (error, request, response, next) {
            if (error.name === "ValidationError") { // mongoose error
                response.status(409);
                response.render("409.html", {status: 409, error: error});
            } else {
                response.status(500);
                response.render("500.html", {status: 500, error: error, url: request.url});
            }
        });
        /* jshint unused: true */
    }
};