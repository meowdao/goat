"use strict";

var nodemailer = require("nodemailer"),
    hbs = require("express-hbs"),
    Styliner = require("styliner"),
    Q = require("q"),
    _ = require("lodash"),
    utils = require("../utils/utils.js"),
    optOutController = require("../controllers/opt_out.js"),
    config = require("../configs/config.js")[process.env.NODE_ENV],
    transport = nodemailer.createTransport(config.smtp);

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

                    return Q.denodeify(hbs.express3({
                        partialsDir: utils.getPath("views", "email", "partials"),
                        layoutsDir: utils.getPath("views", "email", "layouts"),
                        extname: ".hbs"
                    }))(utils.getPath("views", "email", query.template + ".hbs"),
                        _.extend(
                            {settings: {views: utils.getPath("views", "email")}}, // required
                            {user: request.user, type: query.template},
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
                                    return Q.nfcall(transport.sendMail.bind(transport), clean);
                                });
                        });
                }
            });
    }
};

module.exports = methods;
