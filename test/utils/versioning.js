"use strict";

import Q from "q";
import assert from "assert";
import debug from "debug";
import mongoose, {Schema} from "mongoose";
import mongooseVersion from "lackey-mongoose-version";

import AbstractController from "../../server/controllers/abstract/abstract.js";

let MyModel = new Schema({
	string: String
}, {versionKey: false});

MyModel.plugin(mongooseVersion, {
	collection: "MyVersions",
	mongoose: mongoose
});

mongoose.model("My", MyModel);

class MyController extends AbstractController {

}
class MyVersionsController extends AbstractController {
}

let myController = new MyController();
let myVersionsController = new MyVersionsController();

let log = debug("test:versioning");

suite("versioning plugin", () => {

	const my = {
		string: "qwerty"
	};

	test("should create record", done => {

		myController.create(my)
			.then(my => {
				log("my", my);
				return myVersionsController.count({refId: my._id})
					.then(count => {
						log("count", count);
						assert.equal(count, 1);
					});
			})
			.catch(e => {
				log(e);
				let messages = Object.keys(e.errors).map(key => e.errors[key].message);
				log(messages);
			})
			.finally(done)
			.done();

	});

	test("should not update record with findOneAndUpdate", done => {

		myController.create(my)
			.then(my => {
				log("my:created", my);
				return myController.findByIdAndUpdate(my._id, {string: "asdfgh"}, {new: true})
					.then(newmy => {
						log("my:updated", newmy);
						return myVersionsController.count({refId: newmy._id})
							.then(count => {
								log("count", count);
								assert.equal(count, 1);
							});
					});
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

	});

	test("should update record after setting same value", done => {

		myController.create(my)
			.then(my => {
				log("my:created", my);
				my.status = "active";
				return myController.save(my)
					.then(newmy => {
						log("my:updated", newmy);
						return myVersionsController.count({refId: newmy._id})
							.then(count => {
								log("count", count);
								assert.equal(count, 2);
							});
					});
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

	});

	test("should update record after setting new value", done => {

		myController.create(my)
			.then(my => {
				log("my:created", my);
				my.string = "zxcvbn";
				return myController.save(my)
					.then(newmy => {
						log("my:updated", newmy);
						return myVersionsController.count({refId: newmy._id})
							.then(count => {
								log("count", count);
								assert.equal(count, 2);
							});
					});
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

	});

	suiteTeardown(done => {
		Q.all([
			myController.remove(),
			myVersionsController.remove()
		])
			.finally(done)
			.done();
	});

});
