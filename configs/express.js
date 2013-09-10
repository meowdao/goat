"use strict";

var express = require("express"),
    cons = require("consolidate"),
    mongoStore = require("connect-mongo")(express);

module.exports = function (config, app) {

    app.set("port", process.env.PORT || config.port);
    app.set("view engine", "html");
    app.set("views", config.templatesPath);
    app.engine("html", cons.underscore);

    var maxAge = 86400000; //one day
    if (process.env.NODE_ENV === "development") {
        maxAge = 0;
    }

    app.use(express.static("assets", {maxAge: maxAge}));

    app.use(express.compress());
    app.use(express.logger("dev")); // "default", "short", "tiny", "dev"
    app.use(express.cookieParser("keyboardcat"));
    app.use(express.session({
        secret: "keyboardcat",
        cookie: {
            //domain : ".mydomain.com",
            //path: "/",
            maxAge: 31536000000, // 1 year
            httpOnly: true,
            secure: false
        },
        // express/mongo session storage
        store: new mongoStore({
            url: config.mongoUrl,
            collection: "sessions",
            interval: 120000  // 2 hours
        })
    }));
    app.use(express.bodyParser());
    app.use(express.favicon());
    //app.use(express.methodOverride());

    app.use(app.router);

    app.use(function (request, response) {
        response.render("404.html", { status: 404, url: request.url });
    });

    if (process.env.NODE_ENV === "development") {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    }
};