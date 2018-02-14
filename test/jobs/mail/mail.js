import winston from "winston";
import assert from "power-assert";
import mailJob from "../../../server/mail/jobs/mail";
import {setUp, tearDown} from "../../../test-utils/flow";

import MailController from "../../../server/mail/controllers/mail";


describe("Mail", () => {
	const mailController = new MailController();

	describe("#Message", () => {
		before(() =>
			setUp([{
				model: "Mail",
				data: [{
					status: MailController.statuses.new
				}, {
					status: MailController.statuses.cancelled
				}, {
					status: MailController.statuses.failed
				}, {
					status: MailController.statuses.sent
				}]
			}])
		);

		it("send `welcome`", () =>
			mailJob()
				.then(mails => {
					winston.info(mails);
					assert.equal(mails.length, 1);
					return mailController.count({status: MailController.statuses.sent})
						.then(count => {
							assert.equal(count, 2);
						});
				})
		);

		after(tearDown);
	});
});
