import {makeError} from "../../server/utils/error";
import {translate} from "../../server/utils/lang";
import assert from "power-assert";
import langServer from "../../server/lang/en/server";


describe("Error", () => {
	describe("#makeError", () => {
		it("makeError page-not-found, user.language: 'en', 400", () => {
			const user = {language: "en"};
			const error = makeError("server.page-not-found", user, 400);
			assert.equal(error.message, langServer["page-not-found"]);
			assert.equal(error.status, 400);
		});

		it("makeError user = null", () => {
			const user = null;
			const error = makeError("server.page-not-found", user, 400);
			assert.equal(error.message, langServer["page-not-found"]);
			assert.equal(error.status, 400);
		});

		it("makeError fake-key", () => {
			const user = {language: "en"};
			const error = makeError("server.fake-key", user, 400);
			assert.equal(error.message, "server.fake-key");
			assert.equal(error.status, 400);
		});

		it("makeError empty code", () => {
			const user = {language: "en"};
			const error = makeError("server.page-not-found", user);
			assert.equal(error.message, langServer["page-not-found"]);
			assert.equal(error.status, 400);
		});
	});

	describe("#translate", () => {
		it("translate error.server.page-not-found, user.language: 'en'", () => {
			const path = "server.page-not-found";
			const user = {language: "en"};
			assert.equal(translate(path, user), langServer["page-not-found"]);
		});

		it.skip("translate non existing language", () => {
			const path = "server.page-not-found";
			const user = {language: "no-lang"};
			assert.throws(() => {
				translate(path, user);
			});
		});

		it("translate non existing path", () => {
			const path = "server.no-path-for-translate-using-translate";
			const user = {language: "en"};
			assert.equal(translate(path, user), path);
		});
	});
});
