"use strict";

import Q from "q";

export default class AbstractController {

	constructor(model, defaults) {
		this.model = model;
		this.defaults = defaults;
	}

	static enchant(query, options, defaults) {
		options = Object.assign({lean: true}, defaults, options);
		Object.keys(options).forEach(function (method) {
			query[method](options[method]);
		});
		return Q.nbind(query.exec, query)();
	}

	findById(id, options) {
		return this.constructor.enchant(this.model.findById(id), options, this.defaults);
	}

	find(query, options) {
		return this.constructor.enchant(this.model.find.apply(this.model, [].concat(query || {})), options, this.defaults);
	}

	findOne(query, options) {
		return this.constructor.enchant(this.model.findOne(query), options, this.defaults);
	}

	update(query, update) {
		return Q.nbind(this.model.update, this.model)(query, update, {
			strict: true,
			multi: true
		}).get(0);
	}

	upsert(query, update) {
		return Q.nbind(this.model.update, this.model)(query, update, {
			strict: true,
			upsert: true
		}).get(0);
	}

	populate(list, path, options) {
		return Q.nbind(this.model.populate, this.model)(list, [{
			path: path,
			options: options || {}
		}]);
	}

	insert(query) {
		return this.create(query);
	}

	search(text) {
		return this.find({$text: {$search: text}});
	}

	save(model) {
		return Q.denodeify(model.save, model)().get(0);
	}

	// TODO: simplify this code

	count() {
		return Q.nfapply(this.model.count.bind(this.model), Array.prototype.slice.call(arguments));
	}

	distinct() {
		return Q.nfapply(this.model.distinct.bind(this.model), Array.prototype.slice.call(arguments));
	}

	remove() {
		return Q.nfapply(this.model.remove.bind(this.model), Array.prototype.slice.call(arguments));
	}

	create() {
		return Q.nfapply(this.model.create.bind(this.model), Array.prototype.slice.call(arguments));
	}

	aggregate() {
		return Q.nfapply(this.model.aggregate.bind(this.model), Array.prototype.slice.call(arguments));
	}

	mapReduce() {
		return Q.nfapply(this.model.mapReduce.bind(this.model), Array.prototype.slice.call(arguments));
	}

	findByIdAndRemove() {
		return Q.nfapply(this.model.findByIdAndRemove.bind(this.model), Array.prototype.slice.call(arguments));
	}

	findByIdAndUpdate() {
		return Q.nfapply(this.model.findByIdAndUpdate.bind(this.model), Array.prototype.slice.call(arguments));
	}

	findOneAndRemove() {
		return Q.nfapply(this.model.findOneAndRemove.bind(this.model), Array.prototype.slice.call(arguments));
	}

	findOneAndUpdate() {
		return Q.nfapply(this.model.findOneAndUpdate.bind(this.model), Array.prototype.slice.call(arguments));
	}

}
