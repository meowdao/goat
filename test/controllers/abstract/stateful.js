import q from "q";
import winston from "winston";
import assert from "power-assert";
import mongoose, {Schema} from "mongoose";
import {getRandomString} from "../../utils/misc";
import StatefulController from "../../controllers/abstract/stateful";
import AbstractController from "../../controllers/abstract/abstract";
import {cleanUp, mockInChain} from "../../test-utils/flow";


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

describe("Stateful", () => {
	const data = {};

	const testObject = {
		bool: false,
		string: "z",
		number: 42
	};

	describe("#getById", () => {
		before(setUp(data, 2));

		it("should getById (obj)", () => {
			return testStatefulController.getById({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					}
				})
				.then(test => {
					winston.debug("test", test);
					assert.equal(test.bool, data.Test[0].bool);
					assert.equal(test.string, data.Test[0].string);
					assert.equal(test.number, data.Test[0].number);
					assert.equal(test.testId, data.Test[0].testId);
				});
		});

		it("should getById (error 403)", () => {
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

		it("should check (error 403)", () => {
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

		it("should check", () => {
			return testStatefulController.check({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					}
				}, ["child"])
				.then(test => {
					winston.debug("test", test);
					assert.equal(test.child.dummy, data.Child[0].dummy);
				});
		});

		it("should check (error 418)", () => {
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

		after(tearDown());
	});

	describe("#list", () => {
		before(setUp(data, 10));

		it("should list", () => {
			return testStatefulController.list({
					user: data.User[0]
				})
				.then(result => {
					winston.debug("result", result);
					assert.equal(result.list.length, 4);
				});
		});

		after(tearDown());
	});

	describe("#change", () => {
		before(setUp(data, 2));

		it("should edit (full data)", () => {
			return testStatefulController.change({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					},
					body: testObject
				})
				.then(test => {
					winston.debug("test", test);
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, testObject.string);
					assert.equal(test.number, testObject.number);
				});
		});

		it("should edit (part data)", () => {
			return testStatefulController.change({
					user: data.User[1],
					params: {
						testId: data.Test[1].testId
					},
					body: testObject
				}, [], [], ["bool"])
				.then(test => {
					winston.debug("test", test);
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, data.Test[1].string);
					assert.equal(test.number, data.Test[1].number);
				});
		});

		it("should edit (error 404)", () => {
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

		after(tearDown());
	});

	describe("#delete", () => {
		before(setUp(data, 6));

		it("should delete", () => {
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

		it("should delete (error 403)", () => {
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

		it("should delete (error 400)", () => {
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

		it("should deactivate (error 400)", () => {
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

		it("should deactivate (error 403)", () => {
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

		it("should deactivate (error 418)", () => {
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

		after(tearDown());
	});
});
