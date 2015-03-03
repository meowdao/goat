"use strict";

var Q = require("q"),
    _ = require("lodash");

module.exports = function (model, defaults) {

    function enchant (query, options) {
        options = _.extend({lean: true}, defaults, options);
        _.each(options, function(params, method){
            query[method](params);
        });
        return Q.nbind(query.exec, query)();
    }

    var controller = {
        findById: function (id, options) {
            return enchant(model.findById(id), options);
        },
        find: function (query, options) {
            return enchant(model.find.apply(model, [].concat(query || {})), options);
        },
        findOne: function (query, options) {
            return enchant(model.findOne(query), options);
        },

        update: function (query, update) {
            return Q.nbind(model.update, model)(query, update, {strict: true, multi: true}).get(0);
        },
        upsert: function (query, update) {
            return Q.nbind(model.update, model)(query, update, {strict: true, upsert: true}).get(0);
        },
        save: function (model) {
            return Q.nbind(model.save, model)().get(0);
        },

        populate: function (list, path, options) {
            return Q.nbind(model.populate, model)(list, [
                {path: path, options: options || {}}
            ]);
        },

        insert: function (query) {
            return this.create(query);
        },

        search: function (text) {
            return this.find({$text: {$search: text}});
        }
    };

    _.each([
        "count",
        "distinct",
        "remove",
        "create",
        "aggregate",
        "mapReduce",
        "findByIdAndRemove", // options: sort, select
        "findByIdAndUpdate", // options: new, upsert, sort, select
        "findOneAndRemove",
        "findOneAndUpdate"
    ], function (name) {
        controller[name] = function(){
            return Q.nfapply(model[name].bind(model), Array.prototype.slice.call(arguments));
        };
    });

    return controller;
};
