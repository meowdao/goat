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
    messager = require("../utils/messager.js"),
    utils = require("../utils/utils.js"),
    helper = require("../utils/helper.js");

module.exports = function (config, app, passport) {

    app.set("port", process.env.PORT || config.port);
    app.set("jsonp callback", true);
    app.engine("hbs", hbs.express3({
        layoutsDir: utils.getPath("views","site", "layouts"),
        partialsDir: utils.getPath("views" ,"site", "partials")
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

    /*
    app.use(function (request, response, next) {
        if (request.isAuthenticated() && request.headers["x-forwarded-proto"] !== "https") {
            return response.redirect("https://" + request.headers.host + request.path);
        } else {
            return next();
        }
    });

    app.use(function (request, response, next) {
        if (request.method === "POST" || request.method === "PUT") {
            request.body = _.omit(request.body, ["_"]);
        } else {
            request.query = _.omit(request.query, ["_"]);
        }
        return next();
    });
    */

    app.all("*", function (request, response, next) {
        if (!request.get("Origin")) {
            return next();
        }

        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "GET");
        response.set("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");

        if (request.method = "OPTIONS") {
            return response.status(200).end();
        }

        return next();
    });

    require("../routes/index.js")(app);
    require("../routes/message.js")(app);
    require("../routes/opt_out.js")(app);
    require("../routes/user.js")(app);
    require("../routes/user.abstract.js")(app, passport);

    app.use(function (request, response, next) {
        next(messager.makeError("page-not-found", true));
    });

    /* jshint unused: false */
    // next is needed by express
    app.use(function (error, request, response, next) {
        helper.printStackTrace(error, true);

        error.status = error.status || 500;
        if (error.name === "ValidationError") {
            error.status = 409;
        }

        response.render("error.hbs", {error: error, url: request.url}, function (error2, string) {
            if (error2) {
                helper.printStackTrace(error2, true);
                response.status(500).send(messager.makeError("server-error", true));
            } else {
                response.status(error.status).send(string);
            }
        });

    });
    /* jshint unused: true */
};