"use strict";

import assert from "assert";
import {email, firstName, lastName} from "../../server/utils/constants/misc.js";
import {getControllers} from "../utils.js";


const controllers = getControllers(true);

suite("Mail", () => {

	suite("#sendMail", () => {
		test("send mail", (done) => {
			controllers.mail.composeMail("test", {to: email}, {}, {
				user: {
					email,
					firstName,
					lastName
				}
			})
			.then(mail => {
				assert.deepEqual(Array.prototype.slice.call(mail.to), [email]); // SchemaArray
			})
			.catch(assert.ifError)
			.finally(done)
			.done();
		});
	});

});
