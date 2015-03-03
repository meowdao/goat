"use strict";

var hbs = require("express-hbs"),
    mongoose = require("mongoose"),
    logger = require("morgan"),
    session = require("express-session"),
    favicon = require("serve-favicon"),
    serveStatic = require("serve-static"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    compress = require("compression"),
    mongoStore = require("connect-mongo")(session),
    utils = require("../utils/utils.js");

module.exports = function (config, app, passport) {

    app.set("port", process.env.PORT || config.port);
    app.engine("hbs", hbs.express3({
        layoutsDir: utils.getPath("views", "site", "layouts"),
        partialsDir: utils.getPath("views", "site", "partials")
    }));
    app.set("view engine", "hbs");
    app.set("views", utils.getPath("views", "site"));

    var maxAge = 864e5; // 1 day
    if (process.env.NODE_ENV === "development") {
        maxAge = 0;
    }

    if (process.env.NODE_ENV === "development") {
        app.use(serveStatic("assets", {maxAge: maxAge}));
    }
    app.use(serveStatic("dist", {maxAge: maxAge}));

    app.use(compress());
    app.use(logger("dev")); // "default", "short", "tiny", "dev"
    app.use(cookieParser("keyboardcat"));
    app.use(session({
        secret: "keyboardcat",
        key: "sid",
        resave: false,
        saveUninitialized: true,
        cookie: {
            //domain : ".mydomain.com",
            //path: "/",
            maxAge: 31536e6, // 1 year
            httpOnly: true,
            secure: false
        },
        // express/mongo session storage
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(favicon(utils.getPath("/dist/img/favicon.ico")));

    app.use(passport.initialize());
    app.use(passport.session());

    require("./routes.js")(app, passport);

};
