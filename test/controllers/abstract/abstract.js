import bluebird from "bluebird";
import winston from "winston";
import assert from "power-assert";
import {Schema} from "mongoose";
import {setUp, tearDown} from "../../../test-utils/flow";
import AbstractController from "../../../server/shared/controllers/abstract";
import {getConnections} from "../../../server/shared/utils/mongoose";


class TestAbstractController extends AbstractController {
	static realm = "oauth2";
}

const TestAbstractSchema = new Schema({
	organizations: [{
		type: Schema.Types.ObjectId,
		ref: "Organization"
	}],
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

const connections = getConnections();

connections.oauth2.model("TestAbstract", TestAbstractSchema);

const testAbstractController = new TestAbstractController();

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
			return testAbstractController.create(new Array(count).fill(1).map((n, i) => ({
				organizations: data.Organization[i % 2],
				bool: true,
				string: String.fromCharCode(97 + i),
				number: i
			})))
				.then(tests => {
					Object.assign(data, {Test: tests});
				});
		});
}

function myTearDown() {
	return () => bluebird.all([
		testAbstractController.remove(),
		tearDown()
	]);
}

describe("Abstract", () => {
	const data = {};
	const testObject = {
		bool: false,
		string: "z",
		number: 42
	};

	describe("#getByUId", () => {
		before(mySetUp(data, 2));

		it("should getByUId", () =>
			testAbstractController.getByUId({
				user: data.User[0],
				params: {
					_id: data.Test[0]._id
				}
			})
				.then(test => {
					winston.info("test", test);
					assert.equal(test.bool, data.Test[0].bool);
					assert.equal(test.string, data.Test[0].string);
					assert.equal(test.number, data.Test[0].number);
				})
		);

		it("should getByUId (error 404)", () =>
			testAbstractController.getByUId({
				user: data.User[1],
				params: {
					_id: data.Test[0]._id
				}
			})
				.catch(e => {
					assert.equal(e.status, 404);
				})
				.then(assert.ifError)
		);

		after(myTearDown());
	});

	describe("#change", () => {
		before(mySetUp(data, 2));

		it("should change", () =>
			testAbstractController.change({
				user: data.User[1],
				params: {
					_id: data.Test[1]._id
				},
				body: testObject
			}, [], [], ["bool"])
				.then(test => {
					winston.debug("test", test);
					assert.equal(test.organizations[0].toString(), data.Organization[1]._id.toString());
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, data.Test[1].string);
					assert.equal(test.number, data.Test[1].number);
				})
		);

		it("should throw (error 404)", () =>
			testAbstractController.change({
				user: data.User[0],
				params: {
					_id: data.Test[1]._id
				},
				body: testObject
			})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.status, 404);
				})
		);

		after(myTearDown());
	});

	describe("#deactivate", () => {
		before(mySetUp(data, 2));

		it("should delete", () =>
			testAbstractController.deactivate({
				user: data.User[0],
				params: {
					_id: data.Test[0]._id
				}
			})
				.then(result => {
					assert.equal(result._id.toString(), data.Test[0]._id.toString());
					return testAbstractController.findById(data.Test[0]._id)
						.then(test => {
							assert.equal(test, null);
						});
				})
		);

		it("should delete (error 404)", () =>
			testAbstractController.deactivate({
				user: data.User[0],
				params: {
					_id: data.Test[1]._id
				}
			})
				.then(assert.ifError)
				.catch(e => {
					assert.equal(e.status, 404);
				})
		);

		after(myTearDown());
	});
});
