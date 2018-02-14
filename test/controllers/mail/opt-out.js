import assert from "power-assert";
import {getNewId} from "../../../server/shared/utils/mongoose";
import {processValidationError} from "../../../server/shared/utils/error";
import OptOutController from "../../../server/mail/controllers/opt-out";
import MailController from "../../../server/mail/controllers/mail";


describe("OptOut", () => {
	const optOutController = new OptOutController(true);

	describe("#create", () => {
		it("should opt out", () =>
			optOutController.create({
				user: getNewId(),
				type: MailController.types.oauth.welcome
			})
				.then(optOut => {
					assert.deepEqual(optOut.type, MailController.types.oauth.welcome);
				})
		);

		it("thould throw `invalid-param` (type)", () =>
			optOutController.create({
				user: getNewId(),
				type: "crap"
			})
				.then(assert.ifError)
				.catch(e => {
					const errors = processValidationError(e);
					assert.equal(errors.length, 1);
					assert.equal(errors[0].message, "invalid-param");
					assert.equal(errors[0].reason, "invalid");
					assert.equal(errors[0].name, "type");
				})
		);
	});
});
