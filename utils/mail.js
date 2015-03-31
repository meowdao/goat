"use strict";

import nodemailer from "nodemailer";
import hbs from "express-hbs";
import Styliner from "Styliner";
import Q from "q";
import _ from "lodash";
import utils from "../utils/utils.js";
import messager from "../utils/messager.js";
import OptOutController from "../controllers/opt_out.js";
import configs from "../configs/config.js";

var config = configs[process.env.NODE_ENV],
    transport = nodemailer.createTransport(config.smtp);

export default {
    /**
     *
     * @param query {Object} {template: String, subject: String}
     * @param params {Object}
     * @param request {Object} {user: UserModel}
     * @returns {Promise}
     */
    sendMail: function (query, params, request) {
        return OptOutController.findOne({user: request.user._id, type: query.template})
            .then(function (optout) {
                messager.checkModel("optout")(!optout);
            })
            .then(function () {
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
                        return new Styliner(utils.getPath("views", "email"), {
                            urlPrefix: "http://" + config.mail.serverHost + "/",
                            compact: true
                        }).processHTML(html)
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

            });
    }
};
