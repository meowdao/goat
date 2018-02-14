import bluebird from "bluebird";
import winston from "winston";
import assert from "power-assert";
import {Schema} from "mongoose";
import {setUp, tearDown} from "../../../test-utils/flow";
import CRUDController from "../../../server/shared/controllers/crud";
import {getConnections} from "../../../server/shared/utils/mongoose";


class TestCRUDController extends CRUDController {
	static realm = "oauth2";
}

const TestCRUDSchema = new Schema({
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

connections.oauth2.model("TestCRUD", TestCRUDSchema);

const testCRUDController = new TestCRUDController();

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
			return testCRUDController.create(new Array(count).fill(1).map((n, i) => ({
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
		testCRUDController.remove(),
		tearDown()
	]);
}

describe("Crud", () => {
	const data = {};
	const testObject = {
		bool: false,
		string: "z",
		number: 42
	};


	describe("#getById", () => {
		before(mySetUp(data, 2));

		it("should getById", () =>
			testCRUDController.getById({
				user: data.User[0],
				params: {
					_id: data.Test[0]._id
				}
			})
				.then(test => {
					winston.debug("test", test);
					assert.equal(test.bool, data.Test[0].bool);
					assert.equal(test.string, data.Test[0].string);
					assert.equal(test.number, data.Test[0].number);
				})
		);

		it("should getById (error 404)", () =>
			testCRUDController.getById({
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

	describe("#list", () => {
		before(mySetUp(data, 5));

		it("should list", () =>
			testCRUDController.list({
				user: data.User[0]
			})
				.then(result => {
					winston.info("result", result);
					assert.equal(result.list.length, 3);
				})
		);

		after(myTearDown());
	});

	describe("#edit", () => {
		before(mySetUp(data, 2));

		it("should edit", () =>
			testCRUDController.edit({
				user: data.User[0],
				params: {
					_id: data.Test[0]._id
				},
				body: testObject
			})
				.then(test => {
					winston.debug("test", test);
					assert.equal(test.organizations[0].toString(), data.Organization[0]._id.toString());
					assert.equal(test.bool, testObject.bool);
					assert.equal(test.string, testObject.string);
					assert.equal(test.number, testObject.number);
				})
		);

		after(myTearDown());
	});

	describe("#delete", () => {
		before(mySetUp(data, 2));

		it("should delete", () =>
			testCRUDController.delete({
				user: data.User[0],
				params: {
					_id: data.Test[0]._id
				}
			})
				.then(result => {
					assert.equal(result._id.toString(), data.Test[0]._id.toString());
					return testCRUDController.findById(data.Test[0]._id)
						.then(test => {
							assert.equal(test, null);
						});
				})
		);

		it("should delete (error 404)", () =>
			testCRUDController.delete({
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
