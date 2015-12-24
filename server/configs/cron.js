"use strict";

import q from "q";
import schedule from "node-schedule";
import debug from "debug";
import MAPI from "../utils/api/nodemailer.js";

const log = debug("log:cron");

export default function() {

	if (process.env.CRON === "true") {

		schedule.scheduleJob("*/5 * * * *", () => {
			const mailController = new (require("../controllers/mail.js"));
			return mailController.find({
				status: mailController.constructor.statuses.new
			}, {lean: false})
			.then(messages => {
				return q.allSettled(messages.map(message => {
					return MAPI.sendMail(message)
					.then(mail => {
						// message.status = mailController.constructor.statuses[mail.message === "Queued. Thank you." ? "queued" : "unrecognized"];
						message.status = mailController.constructor.statuses[mail.message.substring(0, 3) === "250" ? "sent" : "unrecognized"];
						if (message.status === mailController.constructor.statuses.unrecognized) {
							log("WARNING!", mail);
						}
					})
					.catch(e => {
						log(e);
						message.status = mailController.constructor.statuses.failed;
					})
					.finally(() => mailController.save(message));
				}));
			})
			.done();
		});

	} else {
		log("process.env.CRON != true - no processes scheduled");
	}
}
