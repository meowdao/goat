"use strict";

import q from "q";
import debug from "debug";
import assert from "power-assert";
import mongoose, {Schema} from "mongoose";
import AbstractController from "../../../server/controllers/abstract/abstract";
import {cleanUp, mockInChain} from "../../flow";

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
	return () => mockInChain([{
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
		});
}

function tearDown() {
	return () => q.all([
			testAbstractController.remove()
		])
		.then(() => cleanUp());
}

describe("Abstract", () => {
	const data = {};

	const testObject = {
		bool: false,
		string: "z",
		number: 42
	};

	describe("#insert", () => {
		before(setUp(data, 0));
		it("should insert (full data)", () => {
			return testAbstractController.insert({
					user: data.User[0],
					body: testObject
				})
				.then(test => {
					log("test", test);
					assert.equal(test.user.toString(), data.User[0]._id.toString());
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, testObject.string);
					assert.equal(test.number, testObject.number);
				});
		});

		it("should insert (part data)", () => {
			return testAbstractController.insert({
					user: data.User[0],
					body: testObject
				}, ["bool"])
				.then(test => {
					log("test", test);
					assert.equal(test.user.toString(), data.User[0]._id.toString());
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, void (0));
					assert.equal(test.number, void (0));
				});
		});

		after(tearDown());
	});

	describe("#getById", () => {
		before(setUp(data, 2));
		it("should getById (obj)", () => {
			return testAbstractController.getById({
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
				});
		});

		it("should getById (error 404)", () => {
			return testAbstractController.getById({
					user: data.User[1],
					params: {
						_id: data.Test[0]._id
					}
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 404);
				});
		});

		after(tearDown());
	});

	describe("#list", () => {
		before(setUp(data, 5));
		it("should list", () => {
			return testAbstractController.list({
					user: data.User[0]
				})
				.then(result => {
					log("result", result);
					assert.equal(result.list.length, 3);
				});
		});

		after(tearDown());
	});

	describe("#edit", () => {
		before(setUp(data, 2));

		it("should edit (full data)", () => {
			return testAbstractController.edit({
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
				});
		});

		it("should edit (part data)", () => {
			return testAbstractController.edit({
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
				});
		});

		it("should edit (error 404)", () => {
			return testAbstractController.edit({
					user: data.User[0],
					params: {
						_id: data.Test[1]._id
					},
					body: testObject
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 404);
				});
		});

		after(tearDown());
	});

	describe("#delete", () => {
		before(setUp(data, 2));

		it("should delete", () => {
			return testAbstractController.delete({
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
				});
		});

		it("should delete (error 404)", () => {
			return testAbstractController.delete({
					user: data.User[0],
					params: {
						_id: data.Test[1]._id
					}
				})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.code, 404);
				});
		});

		after(tearDown());
	});
});
