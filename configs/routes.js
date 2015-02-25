"use strict";

var helper = require("../utils/helper.js"),
    messager = require("../utils/messager.js");

module.exports = function (app, passport) {

    app.use(function (request, response, next) {
        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
        response.set("Access-Control-Allow-Headers", "Origin,Accept-Charset,Content-Type");
        return next();
    });

    app.use(function (request, response, next) {
        if (request.method === "OPTIONS") {
            return response.status(204).send("");
        }
        next();
    });

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
			delete request.body._;
		} else {
			delete request.query._;
        }
        return next();
    });
    */

    /*
    app.all("*", function (request, response, next) {
        if (!request.get("Origin")) {
            return next();
        }

        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        response.set("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");

        if (request.method = "OPTIONS") {
            return response.status(200).end();
        }

        return next();
    });

    app.use(function (request, response, next) {
        return next(messager.makeError("no-origin", request.get("Origin")));
    });

    app.use(function (request, response, next) {
        return next(messager.makeError("not-acceptable", response.get("Accept-Charset").toLowerCase() === "utf-8"));
    });

    app.use(function (request, response, next) {
        return next(messager.makeError("content-type", response.get("Content-Type").toLowerCase() === "json"));
    });
    */

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
    /*
    app.use(function (error, request, response, next) {
        helper.printStackTrace(error, true);
        if (!error.status) {
            error = messager.makeError("server-error", true);
        }
        response.status(200).json(error);

    });
    */
    /* jshint unused: true */

    /* jshint unused: false */
    // next is needed by express
    app.use(function (error, request, response, next) {
        helper.printStackTrace(error, true);

        if (error.name === "ValidationError") {
            error.status = 409;
        }

        if (!error.status){
            error = messager.makeError("server-error", true);
        }

        response.render("error.hbs", {errors: [error.message], url: request.url}, function (error2, string) {
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