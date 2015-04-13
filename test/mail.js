"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

import mongoose from "../configs/mongoose.js";
import assert from "assert";
import mail from "../utils/mail.js";
import Test from "../assets/js/components/email/test.js"

void(mongoose);

suite("mail", function () {
	this.timeout(10000);

	suite("#sendMail()", function () {
		test("send mail", function (done) {
			mail.sendMail({
				view: Test,
				subject: "Test"
			}, {}, {
				user: {
					email: "test@example.com",
					full_name: "Anonymous"
				}
			})
				.then(function (result) {
					assert.equal(result.message.substring(0, 3), "250"); // true for aws
				})
				.fail(function (error) {
					throw error;
				})
				.finally(function () {
					done();
				})
				.done();
		});
	});

});

