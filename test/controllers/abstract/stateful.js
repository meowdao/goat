"use strict";

import q from "q";
import debug from "debug";
import assert from "power-assert";
import mongoose, {Schema} from "mongoose";
import {getRandomString} from "../../../server/utils/utils";
import StatefulController from "../../../server/controllers/abstract/stateful";
import AbstractController from "../../../server/controllers/abstract/abstract";
import {cleanUp, mockInChain} from "../../flow";

const log = debug("test:model");

class TestStatefulController extends StatefulController {
	static param = "testId";
}
class TestStatefulChildController extends AbstractController {
}

const statuses = TestStatefulController.prototype.constructor.statuses;

const TestStatefulSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	child: {
		type: Schema.Types.ObjectId,
		ref: "TestStatefulChild"
	},
	testId: String,
	bool: {
		type: Boolean
	},
	string: {
		type: String
	},
	number: {
		type: Number
	},
	status: {
		type: String,
		enum: Object.keys(statuses).map(key => statuses[key]),
		default: statuses.active
	}
});

const TestStatefulChildSchema = new Schema({
	dummy: {
		type: String
	}
});

mongoose.model("TestStatefulChild", TestStatefulChildSchema);
mongoose.model("TestStateful", TestStatefulSchema);

const testStatefulController = new TestStatefulController();
const testStatefulChildController = new TestStatefulChildController();

function setUp(data, count) {
	return () => mockInChain([{
		model: "User",
		count: 2
	}])
		.then(result => {
			Object.assign(data, result);
			return testStatefulChildController.create(new Array(count).fill(1).map((n, i) => {
				return {
					dummy: String.fromCharCode(97 + i)
				};
			})).then(children => {
				data.Child = children;
				return testStatefulController.create(new Array(count).fill(1).map((n, i) => ({
						user: data.User[i % 2],
						child: data.Child[i],
						testId: getRandomString(8),
						bool: true,
						string: String.fromCharCode(97 + i),
						number: i,
						status: i === 5 || i === 6 ? statuses.inactive : statuses.active
					})))
					.then(tests => {
						data.Test = tests;
					});
			});
		});
}

function tearDown() {
	return () => q.all([
			testStatefulController.remove(),
			testStatefulChildController.remove()
		])
		.then(() => cleanUp());
}

function teapot() {
	const error = new Error();
	error.message = "I'm a teapot";
	error.code = 418;
	throw error;
}

suite("Stateful", () => {
	const data = {};

	const testObject = {
		bool: false,
		string: "z",
		number: 42
	};

	suite("#getById", () => {
		suiteSetup(setUp(data, 2));

		test("should getById (obj)", () => {
			return testStatefulController.getById({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					}
				})
				.then(test => {
					log("test", test);
					assert.equal(test.bool, data.Test[0].bool);
					assert.equal(test.string, data.Test[0].string);
					assert.equal(test.number, data.Test[0].number);
					assert.equal(test.testId, data.Test[0].testId);
				});
		});

		test("should getById (error 403)", () => {
			return testStatefulController.getById({
					user: data.User[1],
					params: {
						testId: data.Test[0].testId
					}
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				});
		});

		test("should check (error 403)", () => {
			return testStatefulController.check({
					user: data.User[1],
					params: {
						testId: data.Test[0].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				});
		});

		test("should check", () => {
			return testStatefulController.check({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					}
				}, ["child"])
				.then(test => {
					log("test", test);
					assert.equal(test.child.dummy, data.Child[0].dummy);
				});
		});

		test("should check (error 418)", () => {
			return testStatefulController.check({
					user: data.User[1],
					params: {
						testId: data.Test[1].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 418);
				});
		});

		suiteTeardown(tearDown());
	});

	suite("#list", () => {
		suiteSetup(setUp(data, 10));

		test("should list", () => {
			testStatefulController.list({
					user: data.User[0]
				})
				.then(list => {
					log("list", list);
					assert.equal(list.items.length, 4);
				});
		});

		suiteTeardown(tearDown());
	});

	suite("#change", () => {
		suiteSetup(setUp(data, 2));

		test("should edit (full data)", () => {
			return testStatefulController.change({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					},
					body: testObject
				})
				.then(test => {
					log("test", test);
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, testObject.string);
					assert.equal(test.number, testObject.number);
				});
		});

		test("should edit (part data)", () => {
			return testStatefulController.change({
					user: data.User[1],
					params: {
						testId: data.Test[1].testId
					},
					body: testObject
				}, [], [], ["bool"])
				.then(test => {
					log("test", test);
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, data.Test[1].string);
					assert.equal(test.number, data.Test[1].number);
				});
		});

		test("should edit (error 404)", () => {
			return testStatefulController.change({
					user: data.User[0],
					params: {
						testId: data.Test[1].testId
					},
					body: testObject
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				});
		});

		suiteTeardown(tearDown());
	});

	suite("#delete", () => {
		suiteSetup(setUp(data, 6));

		test("should delete", () => {
			return testStatefulController.delete({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					}
				})
				.then(result => {
					assert.equal(result.success, true);
					return testStatefulController.findById(data.Test[0]._id)
						.then(test => {
							assert.equal(test.status, statuses.inactive);
						});
				});
		});

		test("should delete (error 403)", () => {
			return testStatefulController.delete({
					user: data.User[1],
					params: {
						testId: data.Test[2].testId
					}
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				});
		});

		test("should delete (error 400)", () => {
			return testStatefulController.delete({
					user: data.User[1],
					params: {
						testId: data.Test[5].testId
					}
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 400);
				});
		});

		test("should deactivate (error 400)", () => {
			return testStatefulController.deactivate({
					user: data.User[1],
					params: {
						testId: data.Test[5].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 400);
				});
		});

		test("should deactivate (error 403)", () => {
			return testStatefulController.deactivate({
					user: data.User[0],
					params: {
						testId: data.Test[5].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				});
		});

		test("should deactivate (error 418)", () => {
			return testStatefulController.deactivate({
					user: data.User[0],
					params: {
						testId: data.Test[2].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 418);
				});
		});

		suiteTeardown(tearDown());
	});
});
