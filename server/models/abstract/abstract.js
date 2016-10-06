import q from "q";
import mongoose from "mongoose";
import winston from "winston";


export default class AbstractModel {

	constructor(displayName, connection = mongoose) {
		this.model = connection.model(displayName);
	}

	log(where) {
		return (...args) => {
			winston.debug(where, ...args);
		};
	}

	enchant(method, params, options = {}) {
		const query = this.model[method](...params);
		Object.keys(options).forEach(func => {
			if (Array.isArray(options[func])) {
				options[func].forEach(item => {
					query[func](item);
				});
			} else {
				query[func](options[func]);
			}
		});
		return query.exec();
	}

	/**
	 *
	 * @param id {String}
	 * @param options {Object} (select, sort, populate)
	 * @returns {Promise}
	 */
	findById(id, options) {
		return this.enchant("findById", [].concat(id), options)
			.tap(this.log("found"));
	}

	/**
	 *
	 * @param query {Object}
	 * @param options {Object} (select, sort, populate)
	 * @returns {Promise}
	 */
	find(query, options) {
		return this.enchant("find", [].concat(query), options)
			.tap(this.log("found"));
	}

	/**
	 *
	 * @param query {Object}
	 * @param options {Object} (select, sort, populate)
	 * @returns {Promise}
	 */
	findOne(query, options) {
		return this.enchant("findOne", [].concat(query), options)
			.tap(this.log("found"));
	}

	/**
	 *
	 * @param query {Object}
	 * @param data {Object}
	 * @param options {Object} (select, sort, populate)
	 * @param params {Object} (new, upsert, runValidators, setDefaultsOnInsert)
	 * @returns {Promise}
	 */
	upsert(query, data, options, params) {
		return this.enchant("findOneAndUpdate", [query, data, Object.assign({
			new: true,
			runValidators: true,
			setDefaultsOnInsert: true,
			upsert: true
		}, params)], options)
			.tap(this.log("upserted"));
	}

	/**
	 *
	 * @param query {Object}
	 * @param data {Object}
	 * @param options {Object} (setOptions)
	 * @param params {Object} (safe, upsert, multi, strict, overwrite)
	 * @returns {Promise}
	 */
	update(query, data, options, params) {
		// http://mongoosejs.com/docs/api.html#model_Model.update
		return this.enchant("update", [query, data, Object.assign({
			multi: true
		}, params)], options)
			.tap(this.log("updated"));
	}

	/**
	 *
	 * @param model {mongoose.Document}
	 * @returns {Promise}
	 */
	save(model) {
		return model.save()
			.tap(this.log("saved"));
	}

	aggregate(query) {
		return q.nbind(this.model.aggregate, this.model)(query);
	}

	mapReduce(query) {
		return q.nbind(this.model.mapReduce, this.model)(query);
	}

}
; // eslint-disable-line no-extra-semi

[
	"count",
	"distinct",
	"remove",
	"create",
	"findByIdAndRemove",
	"findByIdAndUpdate",
	"findOneAndRemove",
	"findOneAndUpdate"
].forEach(name => {
	AbstractModel.prototype[name] = function abstractModelWrapper(...args) {
		return this.model[name](...args)
			.then(result => {
				if (name === "remove") {
					return result.result;
				}
				if (name === "create" && !result) {
					return [];
				}
				return result;
			})
			.tap(this.log(`${name}${name[name.length - 1] === "e" ? "d" : "ed"}`));
	};
});
