"use strict";

import mongoose from "mongoose";
import debug from "debug";

class RichModel {

	constructor(displayName, isDebuggable, connection = mongoose) {
		this.model = connection.model(displayName);
		this.isDebuggable = isDebuggable;
		this.log = debug(`model:${displayName}`);
	}

	_log(where) {
		return (...args) => {
			if (this.isDebuggable) {
				this.log(where, ...args);
			}
		};
	}

	enchant(method, params, options) {
		let query = this.model[method](...params);
		options = Object.assign({lean: true}, options);
		Object.keys(options).forEach(method => {
			if (Array.isArray(options[method]) && method !== "deepPopulate") {
				options[method].forEach(item => {
					query[method](item);
				});
			} else {
				query[method](options[method]);
			}
		});
		return query.exec();
	}

	/**
	 *
	 * @param id {String}
	 * @param options {Object} (select, sort, populate)
	 * @returns {Q.Promise}
	 */
	findById(id, options) {
		return this.enchant("findById", [id], options)
			.tap(this._log("found"));
	}

	/**
	 *
	 * @param query {Object}
	 * @param options {Object} (select, sort, populate)
	 * @returns {Q.Promise}
	 */
	find(query, options) {
		return this.enchant("find", [query], options)
			.tap(this._log("found"));
	}

	/**
	 *
	 * @param query {Object}
	 * @param options {Object} (select, sort, populate)
	 * @returns {Q.Promise}
	 */
	findOne(query, options) {
		return this.enchant("findOne", [query], options)
			.tap(this._log("found"));
	}

	/**
	 *
	 * @param query {Object}
	 * @param data {Object}
	 * @param options {Object} (select, sort, populate)
	 * @param params {Object} (new, upsert, runValidators, setDefaultsOnInsert)
	 * @returns {Q.Promise}
	 */
	upsert(query, data, options, params) {
		return this.enchant("findOneAndUpdate", [query, data, Object.assign({
				new: true,
				upsert: true,
				runValidators: true,
				setDefaultsOnInsert: true
			}, params)], options)
			.tap(this._log("upserted"));
	}

	/**
	 *
	 * @param query {Object}
	 * @param data {Object}
	 * @param options {Object}
	 * @param params {Object} (safe, upsert, multi, strict, overwrite)
	 * @returns {Q.Promise}
	 */
	update(query, data, options, params) {
		// http://mongoosejs.com/docs/api.html#model_Model.update
		return this.model.update(query, data, Object.assign({
				strict: true,
				multi: true,
				runValidators: true
			}, params))
			.exec()
			.tap(this._log("updated"));
	}

	populate(list, path, options) {
		return this.model.populate(list, [{
			path: path,
			options: Object.assign({}, options)
		}]);
	}

	/**
	 *
	 * @param text {String}
	 * @returns {Q.Promise}
	 */
	search(text) {
		return this.find({$text: {$search: text}})
			.tap(this._log("found"));
	}

	/**
	 *
	 * @param model {mongoose.Document}
	 * @returns {Q.Promise}
	 */
	save(model) {
		return model.save()
			.get(0)
			.tap(this._log("saved"));
	}

	/**
	 *
	 * @param model {mongoose.Document}
	 * @returns {Q.Promise}
	 */
	destroy(model) {
		return model.remove()
			.tap(this._log("destroyed"));
	}

}
; // eslint-disable-line no-extra-semi

[
	"count",
	"distinct",
	"remove",
	"create",
	"aggregate",
	"mapReduce",
	"findByIdAndRemove",
	"findByIdAndUpdate",
	"findOneAndRemove",
	"findOneAndUpdate"
].forEach(name => {
	RichModel.prototype[name] = function (...args) {
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
			.tap(this._log(`${name}${name[name.length - 1] === "e" ? "d" : "ed"}`));
	};
});

export default RichModel;
