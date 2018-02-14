import bluebird from "bluebird";
import winston from "winston";
import SES from "../../shared/connect/aws.ses";

import MailController from "../../mail/controllers/mail";


export default function() {
	const mailController = new MailController();
	return mailController.find({
		to: {$exists: true},
		status: MailController.statuses.new
	}, {lean: false})
		.then(mails =>
			bluebird.all(mails.map(mail =>
				SES.sendEmail(mail)
					.then(() => {
						mail.set("status", MailController.statuses.sent);
					})
					.catch(e => {
						winston.error(e);
						mail.set("status", MailController.statuses.failed);
					})
					.finally(() => mailController.save(mail))
					.reflect()
			))
		);
}
