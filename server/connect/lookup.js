import q from "q";
import winston from "winston";
import Twilio from "twilio";
import {decorate, override} from "core-decorators";
import {callback} from "./abstract/decorators";
import AbstractAPI from "./abstract/abstract";
import langAPI from "../lang/en/api";


export default new class TwilioAPI extends AbstractAPI {

	static key = "LOOKUP_API";

	@override
	get client() {
		return new Twilio.LookupsClient(
			this.config.AccountSID,
			this.config.AuthToken
		);
	}

	// @decorate(test)
	@decorate(callback)
	checkPhoneNumber(done, user) {
		if (!(user && user.phoneNumber)) {
			user.invalidate("phoneNumber", langAPI["twilio-phone-number-is-required"], user.phoneNumber);
			done();
			return q();
		}

		return q.nbind(this.client.phoneNumbers(user.phoneNumber).get)()
			.then(result => {
				user.set("phoneNumber", result.phone_number);
				user.set("phoneNumberLocal", result.national_format);
			})
			.catch(e => {
				winston.notice("phone validation failed", e);
				user.invalidate("phoneNumber", langAPI["twilio-phone-number-is-invalid"], user.phoneNumber);
			})
			.finally(done);
	}
};
