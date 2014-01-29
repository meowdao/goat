"use strict";

var Q = require("q"),
    _ = require("underscore");

module.exports = function (model, defaults) {

    function enchant (query, params) {
        var options = _.extend({lean: true}, defaults, params);
        Object.keys(options).forEach(function (method) {
            query[method](options[method]);
        });
        return Q.nbind(query.exec, query)();
    }

    return {
        getById: function (query, params) {
            return enchant(model.findById(query[model.modelName.toLowerCase()]), params);
        },
        getByIdAndRemove: function (query, params) {
            return enchant(model.findByIdAndRemove(query[model.modelName.toLowerCase()]), params); // options: sort, select
        },
        getWithQuery: function (query, params) {
            return enchant(model.find.apply(model, [].concat(query || {})), params);
        },
        getOne: function (query, params) {
            return enchant(model.findOne(query), params);
        },
        getCount: function (query) {
            return Q.nbind(model.count, model)(query);
        },
        create: function (query) {
            return this.insert(query);
        },
        insert: function (query) {
            return Q.nbind(model.create, model)(query);
        },
        update: function (query, params) {
            return Q.nbind(model.update, model)(query, params, {strict: true, multi: true})
                .then(function (result) {
                    return result[0];
                });
        },
        upsert: function (query, params) {
            return Q.nbind(model.update, model)(query, params, {strict: true, upsert: true})
                .then(function (result) {
                    return result[0];
                });
        },
        distinct: function (query, params) {
            return Q.nbind(model.distinct, model)(params.field, query);
        },
        delete: function (query) {
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
        }
    };
};
