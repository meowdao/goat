"use strict";

var nodemailer = require("nodemailer"),
    hbs = require("express-hbs"),
    Styliner = require("styliner"),
    Q = require("q"),
    _ = require("lodash"),
    optOutController = require("../controllers/opt_out.js"),
    env = process.env.NODE_ENV || "development",
    config = require("../configs/config.js")[env],
    transport = nodemailer.createTransport("SMTP", config.smtp);

var methods = {
    /**
     *
     * @param query {Object} {template: String, subject: String}
     * @param params {Object}
     * @param request {Object} {user: UserModel}
     * @returns {promise}
     */
    sendMail: function (query, params, request) {
        return optOutController.findOne({user: request.user._id, type: query.template})
            .then(function (optout) {
                if (optout) {
                    throw new Error("optout");
                } else {
                    var styliner = new Styliner(config.path.email, {
                        urlPrefix: "http://" + config.mail.serverHost + "/",
                        compact: true
                    });

                    return Q.denodeify(hbs.create().express3({}))(config.path.email + "/" + query.template + ".hbs",
                        _.extend(
                            {settings: {views: config.path.email}},
                            {user: request.user, serverHost: config.mail.serverHost},
                            params
                        ))
                        .then(function (html) {
                            return styliner.processHTML(html)
                                .then(function (inlinedHtml) {
                                    var clean = {
                                        from: config.mail.general.from,
                                        to: request.user.email,
                                        subject: query.subject,
                                        html: inlinedHtml
                                    };
                                    return Q.nfcall(transport.sendMail, clean);
                                });
                        });
                }
            });
    }
};

module.exports = methods;
