import q from "q";
import schedule from "node-schedule";
import MAPI from "../utils/api/mailgun";

import winston from "winston";

export default function () {
	if (process.env.CRON !== "true") {
		winston.info("process.env.CRON != true - no processes scheduled");
	}

	schedule.scheduleJob("*/5 * * * *", () => {
		const mailController = new (require("../controllers/mail"));
		return mailController.find({
			status: mailController.constructor.statuses.new
		}, {lean: false})
			.then(messages =>
				q.allSettled(messages.map(message =>
					MAPI.sendMail(message)
						.then(mail => {
							message.set("status", mailController.constructor.statuses[mail.message === "Queued. Thank you." ? "queued" : "unrecognized"]);
							if (message.status === mailController.constructor.statuses.unrecognized) {
								winston.error("WARNING!", mail);
							}
						})
						.catch(e => {
							winston.error(e);
							message.set("status", mailController.constructor.statuses.failed);
						})
						.finally(() => mailController.save(message))
				))
			)
			.done();
	});
}
