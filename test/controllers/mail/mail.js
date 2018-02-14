import winston from "winston";
import assert from "power-assert";
import {email} from "../../../shared/constants/test";
import {defaultLanguage as language} from "../../../shared/constants/language";
import {localization} from "../../../shared/intl/setup";
import {bookingObject, userObject, organizationObject, vehicleObject} from "../../../test-utils/objects";
import {getNewId} from "../../../server/shared/utils/mongoose";
import {tearDown} from "../../../test-utils/flow";

import MailController from "../../../server/mail/controllers/mail";


describe("Mail", () => {
	const mailController = new MailController(true);

	describe("#sendMail", () => {
		it("send `newBookingForCustomer`", () =>
			mailController.compose("newBookingForCustomer", {to: email}, {language}, {
				bookings: {list: [bookingObject({_id: getNewId().toString()})]}
			})
				.then(mail => {
					assert.deepEqual(mail.to, [email]);
					assert.deepEqual(mail.subject, localization.en.messages["email.types.newBookingForCustomer"]);
				})
		);

		it("send `newBookingForRenter`", () =>
			mailController.compose("newBookingForRenter", {to: email}, {language}, {
				bookings: {list: [bookingObject({_id: getNewId().toString()})]}
			})
				.then(mail => {
					assert.deepEqual(mail.to, [email]);
					assert.deepEqual(mail.subject, localization.en.messages["email.types.newBookingForRenter"]);
				})
		);

		it("send `missing`", () =>
			mailController.compose("missing", {to: email}, {language}, {
				messages: [{
					data: {
						vehicle: vehicleObject({_id: getNewId().toString()}),
						user: userObject({
							_id: getNewId().toString(),
							organization: organizationObject({_id: getNewId().toString()})
						})
					}
				}]
			})
				.then(mail => {
					winston.info(mail);
					assert.deepEqual(mail.to, [email]);
					assert.deepEqual(mail.subject, localization.en.messages["email.types.missing"]);
				})
		);

		after(tearDown);
	});
});
