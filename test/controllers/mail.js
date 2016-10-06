import assert from "power-assert";
import {email, fullName} from "../../server/utils/constants/misc";

import MailController from "../../server/controllers/mail/mail";


describe("Mail", () => {
	const mailController = new MailController(true);

	describe("#sendMail", () => {
		it("send mail", () =>
			mailController.compose("test", {to: email}, {}, {
				user: {
					email,
					fullName
				}
			})
				.then(mail => {
					assert.deepEqual(Array.prototype.slice.call(mail.to), [email]); // SchemaArray
				})
		);
	});
});
