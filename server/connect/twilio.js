import twilio from "twilio";
import {decorate, override} from "core-decorators";
import {promise} from "./abstract/decorators";
import AbstractAPI from "./abstract/abstract";


export default new class TwilioAPI extends AbstractAPI {

	static key = "TWILIO_API";

	@override
	get client() {
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
