"use strict";

var nodemailer = require("nodemailer"),
    Styliner = require("styliner"),
    Q = require("q"),
    _ = require("underscore"),
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
        return optOutController.getOne({user: request.user._id, type: query.template})
            .then(function (optout) {
                if (optout) {
                    throw new Error("optout");
                } else {
                    var styliner = new Styliner("./views/email", {
                        urlPrefix: "http://" + config.mail.serverHost + "/"
                    });

                    //TODO: minify the email
                    return styliner.processHTML(_.partial("email", query.template, _.extend(params, {user: request.user, serverHost: config.mail.serverHost, type: query.template})))
                        .then(function (inlinedHtml) {
                            var clean = {
                                from: config.mail.general.from,
                                to: request.user.email,
                                subject: query.subject,
                                html: inlinedHtml
                            };
                            return Q.nfcall(transport.sendMail, clean);
                        });
                }
            });
    }
};

module.exports = methods;
