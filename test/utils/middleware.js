import moment from "moment-config-trejgun";
import {date} from "../../server/utils/constants/date";
import {
	checkActive,
	checkPast,
	checkPublic,
	checkModel
} from "../../server/utils/middleware";
import assert from "power-assert";
import langServer from "../../server/lang/en/server";
import langNotFound from "../../server/lang/en/not-found";
import langNotActive from "../../server/lang/en/not-active";


describe("Middleware", () => {
	class TestController {
		static realm = "realm";
		static statuses = {
			active: "active",
			semiactive: "semiactive",
			inactive: "inactive"
		};
		static displayName = "Test";
	}

	const testController = new TestController();

	describe("#checkActive", () => {
		describe("#flags", () => {
			it("checkActive isAllowed=true isAdmin=true isActive=true", () => {
				const model = {
					status: TestController.statuses.active
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkActive(true).bind(testController)(model, {user});
				});
			});

			it("checkActive isAllowed=true isAdmin=true isActive=false", () => {
				const model = {
					status: TestController.statuses.inactive
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkActive(true).bind(testController)(model, {user});
				});
			});

			it("checkActive isAllowed=true isAdmin=false isActive=true", () => {
				const model = {
					status: TestController.statuses.active
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.doesNotThrow(() => {
					checkActive(false).bind(testController)(model, {user});
				});
			});

			it("checkActive isAllowed=true isAdmin=false isActive=false", () => {
				const model = {
					status: TestController.statuses.inactive
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.throws(() => {
					checkActive(true).bind(testController)(model, {user});
				}, e => e.message === langNotActive.test);
			});

			it("checkActive isAllowed=false isAdmin=true isActive=false", () => {
				const model = {
					status: TestController.statuses.inactive
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.throws(() => {
					checkActive(false).bind(testController)(model, {user});
				}, e => e.message === langNotActive.test);
			});

			it("checkActive isAllowed=false isAdmin=true isActive=true", () => {
				const model = {
					status: TestController.statuses.active
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkActive(false).bind(testController)(model, {user});
				});
			});

			it("checkActive isAllowed=false isAdmin=false isActive=true", () => {
				const model = {
					status: TestController.statuses.active
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.doesNotThrow(() => {
					checkActive(false).bind(testController)(model, {user});
				});
			});

			it("checkActive isAllowed=false isAdmin=false isActive=false", () => {
				const model = {
					status: TestController.statuses.inactive
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.throws(() => {
					checkActive(false).bind(testController)(model, {user});
				}, e => e.message === langNotActive.test);
			});
		});

		describe("#statuses", () => {
			it("checkActive [] [active]", () => {
				const model = {
					status: TestController.statuses.active
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.throws(() => {
					checkActive(false, []).bind(testController)(model, {user});
				}, e => e.message === langNotActive.test);
			});

			it("checkActive [semiactive] [inactive]", () => {
				const model = {
					status: TestController.statuses.inactive
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.throws(() => {
					checkActive(false, []).bind(testController)(model, {user});
				}, e => e.message === langNotActive.test);
			});

			it("checkActive [semiactive] [semiactive]", () => {
				const model = {
					status: TestController.statuses.active
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.throws(() => {
					checkActive(false, [
						TestController.statuses.semiactive
					]).bind(testController)(model, {user});
				}, e => e.message === langNotActive.test);
			});

			it("checkActive [active, semiactive] [inactive]", () => {
				const model = {
					status: TestController.statuses.inactive
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkActive(true, [
						TestController.statuses.active,
						TestController.statuses.semiactive
					]).bind(testController)(model, {user});
				});
			});

			it("checkActive [active, semiactive] [semiactive]", () => {
				const model = {
					status: TestController.statuses.semiactive
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkActive(true, [
						TestController.statuses.active,
						TestController.statuses.semiactive
					]).bind(testController)(model, {user});
				});
			});
		});
	});

	describe("#checkModel", () => {
		const model = {};
		const user = {};

		it("checkModel with valid user and model", () => {
			assert.doesNotThrow(() => {
				checkModel().bind(testController)(model, {user});
			});
		});

		it("checkModel without user", () => {
			assert.doesNotThrow(() => {
				checkModel().bind(testController)(model);
			});
		});

		it("checkModel without model", () => {
			assert.throws(() => {
				checkModel().bind(testController)(null, {user});
			}, e => e.message === langNotFound.test);
		});
	});

	describe("#checkPast", () => {
		describe("#flags", () => {
			it("checkPast isAllowed=true isAdmin=true isPast=true", () => {
				const model = {
					startTime: moment(date).add(-1, "d")
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkPast(true)(model, {user});
				});
			});

			it("checkPast isAllowed=true isAdmin=true isPast=false", () => {
				const model = {
					startTime: moment(date).add(+1, "d")
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkPast(true)(model, {user});
				});
			});

			it("checkPast isAllowed=true isAdmin=false isPast=true", () => {
				const model = {
					startTime: moment(date).add(-1, "d")
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.throws(() => {
					checkPast(true)(model, {user});
				});
			});

			it("checkPast isAllowed=true isAdmin=false isPast=false", () => {
				const model = {
					startTime: moment(date).add(+1, "d")
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.doesNotThrow(() => {
					checkPast(true)(model, {user});
				});
			});

			it("checkPast isAllowed=false isAdmin=true isPast=true", () => {
				const model = {
					startTime: moment(date).add(-1, "d")
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.throws(() => {
					checkPast(false)(model, {user});
				});
			});

			it("checkPast isAllowed=false isAdmin=true isPast=false", () => {
				const model = {
					startTime: moment(date).add(+1, "d")
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkPast(false)(model, {user});
				});
			});

			it("checkPast isAllowed=false isAdmin=false isPast=true", () => {
				const model = {
					startTime: moment(date).add(-1, "d")
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.throws(() => {
					checkPast(false)(model, {user});
				});
			});

			it("checkPast isAllowed=false isAdmin=false isPast=false", () => {
				const model = {
					startTime: moment(date).add(+1, "d")
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.doesNotThrow(() => {
					checkPast(false)(model, {user});
				});
			});
		});

		describe("#fields", () => {
			it("checkPast with defaults", () => {
				const model = {
					startTime: moment(date).add(+1, "d")
				};
				const user = {
					apiKey: {
						public: true
					}
				};
				assert.doesNotThrow(() => {
					checkPast()(model, {user});
				});
			});

			it("checkPast field=endTime", () => {
				const model = {
					startTime: moment(date).add(-1, "d"),
					endTime: moment(date).add(+1, "d")
				};
				const user = {
					apiKey: {
						public: false
					}
				};
				assert.doesNotThrow(() => {
					checkPast(false, "endTime")(model, {user});
				});
			});
		});
	});

	describe("#checkPublic", () => {
		it("checkOwner public=true", () => {
			const model = {
				public: true
			};
			assert.doesNotThrow(() => {
				checkPublic().bind(testController)(model, {});
			});
		});

		it("checkOwner public=true", () => {
			const model = {
				public: false
			};
			assert.throws(() => {
				checkPublic(true).bind(testController)(model, {});
			}, e => e.message === langServer["access-denied"]);
		});
	});
});
