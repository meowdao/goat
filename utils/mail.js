"use strict";

import Q from "q";
import nodemailer from "nodemailer";
import messager from "../utils/messager.js";
import OptOutController from "../controllers/opt_out.js";
import configs from "../configs/config.js";

var config = configs[process.env.NODE_ENV],
	transport = nodemailer.createTransport(config.smtp);

export default {

	sendMail: function (request, data) {
		return OptOutController.findOne({
			user: request.user._id,
			type: data.view.constructor.name
		})
			.then(function (optout) {
				messager.checkModel("optout")(!optout);
			})
			.then(function () {
				return Q.nfcall(transport.sendMail.bind(transport), {
					from: "Adventure Bucket List <no-reply@adventurebucketlist.com>",
					to: request.user.email,
					subject: data.subject,
					html: React.renderToStaticMarkup(<EML view={data.view} user={request.user}/>)
				});
			});
	}

};