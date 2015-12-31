"use strict";

import debug from "debug";
import twilio from "twilio";
import configs from "../../configs/config.js";
import wrapper from "./wrapper.js";

const config = configs[process.env.NODE_ENV];
const log = debug("log:twilio");
const client = twilio(config.server.twilio.AccountSID, config.server.twilio.AuthToken);

export default function API() {

}

API.key = "TWILIO_API";

API.sendSMS = wrapper.promise(function(message) {
	return client.messages.create(Object.assign(message.toObject(), {from: config.server.twilio.from}))
		.catch(e => {
			log(e);
			throw e;
		});
});
