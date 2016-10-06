import q from "q";
import assert from "power-assert";
import winston from "winston";
import mongoose, {Schema} from "mongoose";
import mongooseVersion from "lackey-mongoose-version";

import AbstractController from "../../server/controllers/abstract/abstract.js";

const MyModel = new Schema({
	string: String
}, {versionKey: false});

MyModel.plugin(mongooseVersion, {
	mongoose,
	collection: "MyVersions"
});

mongoose.model("My", MyModel);

class MyController extends AbstractController {

}
class MyVersionsController extends AbstractController {
}

const myController = new MyController();
const myVersionsController = new MyVersionsController();


describe("versioning plugin", () => {
	const my = {
		string: "qwerty"
	};

	it("should create record", () => {
		return myController.create(my)
			.then(myObj => {
				winston.debug("my", myObj);
				return myVersionsController.count({refId: myObj._id})
					.then(count => {
						winston.debug("count", count);
						assert.equal(count, 1);
					});
			})
			.catch(e => {
				winston.debug(e);
				const messages = Object.keys(e.errors)
					.map(key => e.errors[key].message);
				winston.debug(messages);
			});
	});

	it("should not update record with findOneAndUpdate", () => {
		return myController.create(my)
			.then(createdmy => {
				winston.debug("my:created", createdmy);
				return myController.findByIdAndUpdate(createdmy._id, {string: "asdfgh"}, {new: true})
					.then(newmy => {
						winston.debug("my:updated", newmy);
						return myVersionsController.count({refId: newmy._id})
							.then(count => {
								winston.debug("count", count);
								assert.equal(count, 1);
							});
					});
			})
			.catch(assert.ifError);
	});

	it("should update record after setting same value", () => {
		return myController.create(my)
			.then(createdmy => {
				winston.debug("my:created", createdmy);
				createdmy.set("status", "active");
				return myController.save(createdmy)
					.then(newmy => {
						winston.debug("my:updated", newmy);
						return myVersionsController.count({refId: newmy._id})
							.then(count => {
								winston.debug("count", count);
								assert.equal(count, 2);
							});
					});
			})
			.catch(assert.ifError);
	});

	it("should update record after setting new value", () => {
		return myController.create(my)
			.then(createdmy => {
				winston.debug("my:created", createdmy);
				createdmy.set("string", "zxcvbn");
				return myController.save(createdmy)
					.then(newmy => {
						winston.debug("my:updated", newmy);
						return myVersionsController.count({refId: newmy._id})
							.then(count => {
								winston.debug("count", count);
								assert.equal(count, 2);
							});
					});
			})
			.catch(assert.ifError);
	});

	after(() => {
		return q.all([
			myController.remove(),
			myVersionsController.remove()
		]);
	});
});
