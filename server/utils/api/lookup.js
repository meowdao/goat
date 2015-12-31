"use strict";

import q from "q";
import debug from "debug";
import Twilio from "twilio";
import configs from "../../configs/config.js";
import lang from "../lang.js";
import wrapper from "./wrapper.js";

const config = configs[process.env.NODE_ENV];
const log = debug("log:lookup");
const lookupClient = new Twilio.LookupsClient(config.server.twilio.AccountSID, config.server.twilio.AuthToken);

export default function API() {

}

API.key = "LOOKUP_API";


API.checkPhoneNumber = wrapper.callback(function(done, user) {

	if (!(user && user.phoneNumber)) {
		user.invalidate("phoneNumber", lang.translate("error/server/twilio-phone-number-required", user), user.phoneNumber);
		done();
		return q();
	}

	return q.nbind(lookupClient.phoneNumbers(user.phoneNumber).get)()
		.then(result => {
			user.phoneNumber = result.phone_number;
			done();
		})
		.catch(e => {
			log("phone validation failed", e);
			user.invalidate("phoneNumber", lang.translate("error/server/twilio-phone-number-invalid", user), user.phoneNumber);
			done();
		});
});
