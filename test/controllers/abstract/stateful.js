"use strict";

import Q from "q";
import debug from "debug";
import assert from "assert";
import mongoose, {Schema} from "mongoose";
import utils from "../../../server/utils/utils.js";
import StatefulController from "../../../server/controllers/abstract/stateful.js";
import AbstractController from "../../../server/controllers/abstract/abstract.js";
import {cleanUp, mockInChain} from "../../utils.js";

let log = debug("test:model");

class TestStatefulController extends StatefulController {
	static param = "testId";
}
class TestStatefulChildController extends AbstractController {
}

const statuses = TestStatefulController.prototype.constructor.statuses;

let TestStatefulSchema = new Schema({
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

let TestStatefulChildSchema = new Schema({
	dummy: {
		type: String
	}
});

mongoose.model("TestStatefulChild", TestStatefulChildSchema);
mongoose.model("TestStateful", TestStatefulSchema);

let testStatefulController = new TestStatefulController();
let testStatefulChildController = new TestStatefulChildController();

function setUp(data, count) {
	return (done) => {

		mockInChain([{
			model: "User",
			count: 2
		}])
			.then(result => {
				Object.assign(data, result);
				return testStatefulChildController.create(new Array(count).fill(1).map(function (n, i) {
					return {
						dummy: String.fromCharCode(97 + i)
					};
				})).then(result => {
					data.Child = result;
					return testStatefulController.create(new Array(count).fill(1).map(function (n, i) {
							return {
								user: data.User[i % 2],
								child: data.Child[i],
								testId: utils.getRandomString(8),
								bool: true,
								string: String.fromCharCode(97 + i),
								number: i,
								status: i === 5 || i === 6 ? statuses.inactive : statuses.active
							};
						}))
						.then(result => {
							data.Test = result;
						});
				})
			})
			.finally(done)
			.done();
	};
}

function tearDown() {
	return (done) => {
		Q.all([
				testStatefulController.remove(),
				testStatefulChildController.remove()
			])
			.finally(() => cleanUp(done))
			.done();
	};
}

function teapot() {
	let e = new Error();
	e.message = "I'm a teapot";
	e.code = 418;
	throw e;
}

suite("Stateful", () => {

	let data = {};

	const testObject = {
		bool: false,
		string: "z",
		number: 42
	};

	suite("#getById", () => {

		suiteSetup(setUp(data, 2));

		test("should getById (obj)", done => {

			testStatefulController.getById({
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
				})
				.catch(assert.ifError)
				.finally(done)
				.done();

		});

		test("should getById (error 403)", done => {

			testStatefulController.getById({
					user: data.User[1],
					params: {
						testId: data.Test[0].testId
					}
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				})
				.finally(done)
				.done();

		});

		test("should check (error 403)", done => {

			testStatefulController.check({
					user: data.User[1],
					params: {
						testId: data.Test[0].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				})
				.finally(done)
				.done();

		});

		test("should check", done => {

			testStatefulController.check({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					}
				}, ["child"])
				.then(test => {
					log("test", test);
					assert.equal(test.child.dummy, data.Child[0].dummy);
				})
				.catch(assert.ifError)
				.finally(done)
				.done();

		});

		test("should check (error 418)", done => {

			testStatefulController.check({
					user: data.User[1],
					params: {
						testId: data.Test[1].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 418);
				})
				.finally(done)
				.done();

		});

		suiteTeardown(tearDown());

	});

	suite("#list", () => {

		suiteSetup(setUp(data, 10));

		test("should list", done => {

			testStatefulController.list({
					user: data.User[0]
				})
				.then(test => {
					log("test", test);
					assert.equal(test.teststatefuls.length, 4);
				})
				.catch(assert.ifError)
				.finally(done)
				.done();

		});

		suiteTeardown(tearDown());

	});

	suite("#edit", () => {

		suiteSetup(setUp(data, 2));

		test("should edit (full data)", done => {

			testStatefulController.edit({
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
				})
				.catch(assert.ifError)
				.finally(done)
				.done();

		});

		test("should edit (part data)", done => {

			testStatefulController.edit({
					user: data.User[1],
					params: {
						testId: data.Test[1].testId
					},
					body: testObject
				}, [], ["bool"])
				.then(test => {
					log("test", test);
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, data.Test[1].string);
					assert.equal(test.number, data.Test[1].number);
				})
				.catch(assert.ifError)
				.finally(done)
				.done();

		});

		test("should edit (error 404)", done => {

			testStatefulController.edit({
					user: data.User[0],
					params: {
						testId: data.Test[1].testId
					},
					body: testObject
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				})
				.finally(done)
				.done();

		});

		suiteTeardown(tearDown());

	});

	suite("#delete", () => {

		suiteSetup(setUp(data, 6));

		test("should delete", done => {

			testStatefulController.delete({
					user: data.User[0],
					params: {
						testId: data.Test[0].testId
					}
				})
				.then(test => {
					assert.equal(test.success, true);
					return testStatefulController.findById(data.Test[0]._id)
						.then(test => {
							assert.equal(test.status, statuses.inactive);
						});
				})
				.catch(assert.ifError)
				.finally(done)
				.done();

		});

		test("should delete (error 403)", done => {

			testStatefulController.delete({
					user: data.User[1],
					params: {
						testId: data.Test[2].testId
					}
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				})
				.finally(done)
				.done();

		});

		test("should delete (error 400)", done => {

			testStatefulController.delete({
					user: data.User[1],
					params: {
						testId: data.Test[5].testId
					}
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 400);
				})
				.finally(done)
				.done();

		});

		test("should deactivate (error 400)", done => {

			testStatefulController.deactivate({
					user: data.User[1],
					params: {
						testId: data.Test[5].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 400);
				})
				.finally(done)
				.done();

		});

		test("should deactivate (error 403)", done => {

			testStatefulController.deactivate({
					user: data.User[0],
					params: {
						testId: data.Test[5].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 403);
				})
				.finally(done)
				.done();

		});

		test("should deactivate (error 418)", done => {

			testStatefulController.deactivate({
					user: data.User[0],
					params: {
						testId: data.Test[2].testId
					}
				}, [], [teapot])
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 418);
				})
				.finally(done)
				.done();

		});

		suiteTeardown(tearDown());

	});


});


