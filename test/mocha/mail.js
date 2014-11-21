"use strict";

var env = process.env.NODE_ENV || "development",
    config = require("../../configs/config.js")[env],
    mongoose = require("../../configs/mongoose.js")(config),
    assert = require("assert"),
    mailUtil = require("../../utils/mail.js");

void(mongoose);

suite("mail", function () {
    this.timeout(10000);

    suite("#sendMail()", function () {
        test("send mail", function (done) {
            mailUtil.sendMail({template: "test", subject: "Test"}, {}, {user: {email: config.mail.general.to, full_name: "Anonymous"}})
                .then(function (result) {
                    assert.equal(result.message.substring(0,3), "250"); // true for aws
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

