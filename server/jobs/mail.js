// HACK
import "core-js/fn/object/values";

import q from "q";
import winston from "winston";
import MAPI from "../connect/mailgun";

import MailController from "../controllers/mail/mail";


const mailController = new MailController();
mailController.find({
	status: MailController.statuses.new
}, {lean: false})
	.then(mails =>
		q.allSettled(mails.map(mail =>
			MAPI.sendMail(mail)
				.then(result => {
					mail.set("status", MailController.statuses[result.message === "Queued. Thank you." ? "queued" : "unrecognized"]);
					if (mail.status === MailController.statuses.unrecognized) {
						winston.warn("WARNING!", result);
					}
				})
				.catch(e => {
					winston.info(e);
					mail.set("status", MailController.statuses.failed);
				})
				.finally(() => mailController.save(mail))
		))
	)
	.then(result => {
		winston.info("OK", result.length);
	})
	.catch(e => {
		winston.info("FAIL", e);
	})
	.done(() => {
		winston.info("DONE");
	});
