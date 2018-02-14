import bluebird from "bluebird";
import winston from "winston";
import assert from "power-assert";
import {Schema} from "mongoose";
import {getRandomString} from "../../../server/shared/utils/misc";
import StatefulController from "../../../server/shared/controllers/stateful";
import AbstractController from "../../../server/shared/controllers/abstract";
import {setUp, tearDown} from "../../../test-utils/flow";
import {wrapRequest, wrapResponse} from "../../../test-utils/wrapper";
import {getConnections} from "../../../server/shared/utils/mongoose";


class TestStatefulController extends StatefulController {
	static realm = "oauth2";
	static param = "testId";
}
class TestStatefulChildController extends AbstractController {
	static realm = "oauth2";
}

const statuses = TestStatefulController.statuses;

const TestStatefulSchema = new Schema({
	organizations: [{
		type: Schema.Types.ObjectId,
		ref: "Organization"
	}],
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

const connections = getConnections();

connections.oauth2.model("TestStatefulChild", TestStatefulChildSchema);
connections.oauth2.model("TestStateful", TestStatefulSchema);

const testStatefulController = new TestStatefulController();
const testStatefulChildController = new TestStatefulChildController();

function mySetUp(data, count) {
	return () => setUp([{
		model: "Organization",
		count: 2
	}, {
		model: "User",
		requires: {
			Organization: "o2o"
		},
		count: 2
	}])
		.then(result => {
			Object.assign(data, result);
			return testStatefulChildController.create(new Array(count).fill(1).map((n, i) =>
				({
					dummy: String.fromCharCode(97 + i)
				})
			))
				.then(children => {
					Object.assign(data, {Child: children});
					return testStatefulController.create(new Array(count).fill(1).map((n, i) =>
						({
							organizations: data.Organization[i % 2],
							child: data.Child[i],
							testId: getRandomString(8),
							bool: true,
							string: String.fromCharCode(97 + i),
							number: i,
							status: i % 5 === 0 ? statuses.inactive : statuses.active
						})
					))
						.then(parent => {
							Object.assign(data, {Test: parent});
						});
				});
		});
}

function myTearDown() {
	return () => bluebird.all([
		testStatefulController.remove(),
		testStatefulChildController.remove(),
		tearDown()
	]);
}

function teapot() {
	const e = new Error();
	e.message = "I'm a teapot";
	e.status = 418;
	throw e;
}

describe("Stateful", () => {
	const data = {};
	const testObject = {
		bool: false,
		string: "z",
		number: 42
	};

	describe("#getByUId", () => {
		before(mySetUp(data, 2));

		it("should get object", () =>
			testStatefulController.getByUId({
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
				})
		);

		it("should throw (error 403)", () =>
			testStatefulController.getByUId({
				user: data.User[1],
				params: {
					testId: data.Test[0].testId
				}
			})
				.catch(e => {
					assert.equal(e.status, 403);
				})
				.then(assert.ifError)
		);

		it("should get objec + populate", () =>
			testStatefulController.getByUId({
				user: data.User[0],
				params: {
					testId: data.Test[0].testId
				}
			}, {populate: ["child"]})
				.then(test => {
					winston.debug("test", test);
					assert.equal(test.child.dummy, data.Child[0].dummy);
				})
		);

		it("should throw  (error 418)", () =>
			testStatefulController.getByUId({
				user: data.User[1],
				params: {
					testId: data.Test[1].testId
				}
			}, {}, [teapot])
				.catch(e => {
					assert.equal(e.status, 418);
				})
				.then(assert.ifError)
		);

		after(myTearDown());
	});

	describe("#list", () => {
		before(mySetUp(data, 50));

		it("should list", () =>
			testStatefulController.list(wrapRequest({
				user: data.User[0]
			}), wrapResponse())
				.then(result => {
					winston.debug("result", result);
					assert.equal(result.list.length, 25);
				})
		);

		it("should respect status", () =>
			testStatefulController.list(wrapRequest({
				user: data.User[0],
				query: {
					status: statuses.inactive
				}
			}), wrapResponse())
				.then(result => {
					winston.debug("result", result);
					assert.equal(result.list.length, 5);
				})
		);

		it("should respect pagination options (limit)", () =>
			testStatefulController.list(wrapRequest({
				user: data.User[0],
				query: {
					limit: 5
				}
			}), wrapResponse())
				.then(result => {
					winston.debug("result", result);
					assert.equal(result.list.length, 5);
				})
		);

		it("should respect pagination options (limit + skip)", () =>
			testStatefulController.list(wrapRequest({
				user: data.User[0],
				query: {
					limit: 15,
					skip: 15
				}
			}), wrapResponse())
				.then(result => {
					winston.debug("result", result);
					assert.equal(result.list.length, 10);
				})
		);

		after(myTearDown());
	});

	describe("#edit", () => {
		before(mySetUp(data, 2));

		it("should edit", () =>
			testStatefulController.edit({
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
				})
		);

		it("should edit (part data)", () =>
			testStatefulController.change({
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
				})
		);

		it("should edit (error 404)", () =>
			testStatefulController.edit({
				user: data.User[0],
				params: {
					testId: data.Test[1].testId
				},
				body: testObject
			})
				.catch(e => {
					assert.equal(e.status, 403);
				})
				.then(assert.ifError)
		);

		after(myTearDown());
	});

	describe("#delete", () => {
		before(mySetUp(data, 6));

		it("should delete", () =>
			testStatefulController.delete({
				user: data.User[0],
				params: {
					testId: data.Test[2].testId
				}
			})
				.then(result => {
					assert.equal(result._id.toString(), data.Test[2]._id.toString());
					assert.equal(result.status, statuses.inactive);
					return testStatefulController.findById(data.Test[2]._id)
						.then(test2 => {
							assert.equal(test2.status, statuses.inactive);
						});
				})
		);

		it("should delete (error 403)", () =>
			testStatefulController.delete({
				user: data.User[1],
				params: {
					testId: data.Test[4].testId
				}
			})
				.catch(e => {
					assert.equal(e.status, 403);
				})
				.then(assert.ifError)
		);

		it("should delete (error 410)", () =>
			testStatefulController.delete({
				user: data.User[1],
				params: {
					testId: data.Test[5].testId
				}
			})
				.catch(e => {
					assert.equal(e.status, 410);
				})
				.then(assert.ifError)
		);

		after(myTearDown());
	});

	describe("#deactivate", () => {
		before(mySetUp(data, 6));

		it("should deactivate", () =>
			testStatefulController.deactivate({
				user: data.User[0],
				params: {
					testId: data.Test[2].testId
				}
			}, [], [])
				.then(test1 => {
					assert.equal(test1.status, statuses.inactive);
					return testStatefulController.findById(data.Test[0]._id)
						.then(test2 => {
							assert.equal(test2.status, statuses.inactive);
						});
				})
		);

		it("should throw (error 410)", () =>
			testStatefulController.deactivate({
				user: data.User[1],
				params: {
					testId: data.Test[5].testId
				}
			}, [], [teapot])
				.catch(e => {
					assert.equal(e.status, 410);
				})
				.then(assert.ifError)
		);

		it("should throw (error 403)", () =>
			testStatefulController.deactivate({
				user: data.User[0],
				params: {
					testId: data.Test[5].testId
				}
			}, [], [teapot])
				.catch(e => {
					assert.equal(e.status, 403);
				})
				.then(assert.ifError)
		);

		it("should throw (error 418)", () =>
			testStatefulController.deactivate({
				user: data.User[0],
				params: {
					testId: data.Test[4].testId
				}
			}, [], [teapot])
				.catch(e => {
					assert.equal(e.status, 418);
				})
				.then(assert.ifError)
		);

		after(myTearDown());
	});
});
