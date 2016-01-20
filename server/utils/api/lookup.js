"use strict";

import q from "q";
import Twilio from "twilio";
import lang from "../lang.js";
import {decorate, override} from "core-decorators";
import {callback} from "./wrapper.js";
import DebugableAPI from "./debugable.js";


export default new class TwilioAPI extends DebugableAPI {

	static key = "LOOKUP_API";

	@override
	getClient() {
		return new Twilio.LookupsClient(
			this.config.AccountSID,
			this.config.AuthToken
		);
	}

	@decorate(callback)
	checkPhoneNumber(done, user) {
		if (!(user && user.phoneNumber)) {
			user.invalidate("phoneNumber", lang.translate("error/server/twilio-phone-number-required", user), user.phoneNumber);
			done();
			return q();
		}

		return q.nbind(this.client.phoneNumbers(user.phoneNumber).get)()
			.then(result => {
				user.phoneNumber = result.phone_number;
				done();
			})
			.catch(e => {
				this.log("phone validation failed", e);
				user.invalidate("phoneNumber", lang.translate("error/server/twilio-phone-number-invalid", user), user.phoneNumber);
				done();
			});
	}
};
