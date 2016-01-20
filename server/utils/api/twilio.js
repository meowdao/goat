"use strict";

import twilio from "twilio";
import {decorate, override} from "core-decorators";
import {promise} from "./wrapper.js";
import DebugableAPI from "./debugable.js";


export default new class TwilioAPI extends DebugableAPI {

	static key = "TWILIO_API";

	@override
	getClient() {
		return twilio(
			this.config.AccountSID,
			this.config.AuthToken
		);
	}

	// https://www.twilio.com/docs/api/rest/sending-messages
	@decorate(promise)
	sendSMS(message) {
		return this.client.messages.create(Object.assign(message.toObject(), {from: this.config.from}));
	}
};
