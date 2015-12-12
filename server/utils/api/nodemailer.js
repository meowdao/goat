"use strict";

import Q from "q";
import debug from "debug";
import nodemailer from "nodemailer";
import configs from "../../configs/config.js";
import wrapper from "./wrapper.js";

const config = configs[process.env.NODE_ENV];

let log = debug("log:nodemailer");

let client = nodemailer.createTransport(config.server.smtp);

export default function API() {

};

API.key = "MAIL_API";

API.sendMail = wrapper.promise(function (message) {
	return Q.nfcall(client.sendMail.bind(client), Object.assign(message, {from: config.server.smtp.from}));
});


