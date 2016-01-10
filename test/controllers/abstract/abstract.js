"use strict";

import q from "q";
import debug from "debug";
import assert from "power-assert";
import mongoose, {Schema} from "mongoose";
import AbstractController from "../../../server/controllers/abstract/abstract.js";
import {cleanUp, mockInChain} from "../../utils.js";

const log = debug("test:AbstractController");

class TestAbstractController extends AbstractController {
}

const TestAbstractSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	bool: {
		type: Boolean
	},
	string: {
		type: String
	},
	number: {
		type: Number
	}
});

mongoose.model("TestAbstract", TestAbstractSchema);

const testAbstractController = new TestAbstractController();

function setUp(data, count) {
	return (done) => {

		mockInChain([{
			model: "User",
			count: 2
		}])
		.then(result => {
			Object.assign(data, result);
			return testAbstractController.create(new Array(count).fill(1).map((n, i) => ({
				user: data.User[i % 2],
				bool: true,
				string: String.fromCharCode(97 + i),
				number: i
			})))
			.then(tests => {
				data.Test = tests;
			});
		})
		.finally(done)
		.done();
	};
}

function tearDown() {
	return (done) => {
		q.all([
			testAbstractController.remove()
		])
		.finally(() => cleanUp(done))
		.done();
	};
}

suite("Abstract", () => {

	const data = {};

	const testObject = {
		bool: false,
		string: "z",
		number: 42
	};

	suite("#insert", () => {

		suiteSetup(setUp(data, 0));

		test("should insert (full data)", done => {

			testAbstractController.insert({
				user: data.User[0],
				body: testObject
			})
			.then(test => {
				log("test", test);
				assert.equal(test.user.toString(), data.User[0]._id.toString());
				assert.equal(test.bool, testObject.bool);
				assert.equal(test.string, testObject.string);
				assert.equal(test.number, testObject.number);
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

		});

		test("should insert (part data)", done => {

			testAbstractController.insert({
				user: data.User[0],
				body: testObject
			}, ["bool"])
			.then(test => {
				log("test", test);
				assert.equal(test.user.toString(), data.User[0]._id.toString());
				assert.equal(test.bool, testObject.bool);
				assert.equal(test.string, void (0));
				assert.equal(test.number, void (0));
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

		});

		suiteTeardown(tearDown());
	});

	suite("#getById", () => {

		suiteSetup(setUp(data, 2));

		test("should getById (obj)", done => {

			testAbstractController.getById({
				user: data.User[0],
				params: {
					_id: data.Test[0]._id
				}
			})
			.then(test => {
				log("test", test);
				assert.equal(test.bool, data.Test[0].bool);
				assert.equal(test.string, data.Test[0].string);
				assert.equal(test.number, data.Test[0].number);
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

		});

		test("should getById (error 404)", done => {

			testAbstractController.getById({
				user: data.User[1],
				params: {
					_id: data.Test[0]._id
				}
			})
			.then(assert.ifError)
			.catch(e => {
				assert.equal(e.code, 404);
			})
			.finally(done)
			.done();

		});

		suiteTeardown(tearDown());

	});

	suite("#list", () => {

		suiteSetup(setUp(data, 5));

		test("should list", done => {

			testAbstractController.list({
				user: data.User[0]
			})
			.then(list => {
				log("list", list);
				assert.equal(list.items.length, 3);
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

			testAbstractController.edit({
				user: data.User[0],
				params: {
					_id: data.Test[0]._id
				},
				body: testObject
			})
			.then(test => {
				log("test", test);
				assert.equal(test.user.toString(), data.User[0]._id.toString());
				assert.equal(test.bool, testObject.bool);
				assert.equal(test.string, testObject.string);
				assert.equal(test.number, testObject.number);
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

		});

		test("should edit (part data)", done => {

			testAbstractController.edit({
				user: data.User[1],
				params: {
					_id: data.Test[1]._id
				},
				body: testObject
			}, ["bool"])
			.then(test => {
				log("test", test);
				assert.equal(test.user.toString(), data.User[1]._id.toString());
				assert.equal(test.bool, testObject.bool);
				assert.equal(test.string, data.Test[1].string);
				assert.equal(test.number, data.Test[1].number);
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

		});

		test("should edit (error 404)", done => {

			testAbstractController.edit({
				user: data.User[0],
				params: {
					_id: data.Test[1]._id
				},
				body: testObject
			})
			.then(assert.ifError)
			.catch(e => {
				assert.equal(e.code, 404);
			})
			.finally(done)
			.done();

		});

		suiteTeardown(tearDown());

	});

	suite("#delete", () => {

		suiteSetup(setUp(data, 2));

		test("should delete", done => {

			testAbstractController.delete({
				user: data.User[0],
				params: {
					_id: data.Test[0]._id
				}
			})
			.then(result => {
				assert.equal(result.success, true);
				return testAbstractController.findById(data.Test[0]._id)
				.then(test => {
					assert.equal(test, null);
				});
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

		});

		test("should delete (error 404)", done => {

			testAbstractController.delete({
				user: data.User[0],
				params: {
					_id: data.Test[1]._id
				}
			})
			.then(assert.ifError)
			.catch(e => {
				assert.equal(e.code, 404);
			})
			.finally(done)
			.done();

		});

		suiteTeardown(tearDown());

	});

});
