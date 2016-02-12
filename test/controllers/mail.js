"use strict";

import assert from "power-assert";
import {email, firstName, lastName} from "../../server/utils/constants/misc";
import {getControllers} from "../controllers";


const controllers = getControllers(true);

describe("Mail", () => {
	describe("#sendMail", () => {
		it("send mail", () => {
			return controllers.mail.composeMail("test", {to: email}, {}, {
				user: {
					email,
					firstName,
					lastName
				}
			})
			.then(mail => {
				assert.deepEqual(Array.prototype.slice.call(mail.to), [email]); // SchemaArray
			});
		});
	});
});
