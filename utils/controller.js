"use strict";

var Q = require("q"),
    _ = require("lodash");

module.exports = function (model, defaults) {

    function enchant (query, params) {
        var options = _.extend({lean: true}, defaults, params);
        Object.keys(options).forEach(function (method) {
            query[method](options[method]);
        });
        return Q.nbind(query.exec, query)();
    }

    return {
        findById: function (query, params) {
            return enchant(model.findById(query[model.modelName.toLowerCase()]), params);
        },
        findByIdAndRemove: function (query, params) {
            return enchant(model.findByIdAndRemove(query[model.modelName.toLowerCase()]), params); // options: sort, select
        },
        find: function (query, params) {
            return enchant(model.find.apply(model, [].concat(query || {})), params);
        },
        findOne: function (query, params) {
            return enchant(model.findOne(query), params);
        },
        count: function (query) {
            return Q.nbind(model.count, model)(query);
        },
        create: function (query) {
            return this.insert(query);
        },
        insert: function (query) {
            return Q.nbind(model.create, model)(query);
        },
        update: function (query, params) {
            return Q.nbind(model.update, model)(query, params, {strict: true, multi: true}).get(0);
        },
        upsert: function (query, params) {
            return Q.nbind(model.update, model)(query, params, {strict: true, upsert: true}).get(0);
        },
        distinct: function (query, params) {
            return Q.nbind(model.distinct, model)(params.field, query);
        },
        remove: function (query) {
            return Q.nbind(model.remove, model)(query);
        },
        search: function (query) {
            return Q.nbind(model.textSearch, model)(query.q);
        },
        populate: function (list, path) {
            return Q.nbind(model.populate, model)(list, [
                {path: path}
            ]);
        },
        save: function (model) {
            return Q.nbind(model.save, model)();
        },
        aggregate: function (query) {
            return Q.nbind(model.aggregate, model)(query);
        },
        mapReduce: function (query) {
            return Q.nbind(model.mapReduce, model)(query);
        }
    };
};
