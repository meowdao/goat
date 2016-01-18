"use strict";

import Q from "q";
import debug from "debug";
import mailgun from "nodemailer-mailgun-transport";
import nodemailer from "nodemailer";
import configs from "../../configs/config.js";
import wrapper from "./wrapper.js";

const config = configs[process.env.NODE_ENV];
const log = debug("log:mailgun");
//const client = nodemailer.createTransport(mailgun({auth: config.server.mailgun}));

export default function API() {

}

API.key = "MAILGUN_API";

API.sendMail = wrapper.promise(function(message) {
	return Q.nfcall(client.sendMail.bind(client), Object.assign(message.toObject(), {from: config.server.mailgun.from}))
		.catch(e => {
			log(e);
			throw e;
		});
});
