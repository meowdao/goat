define(function (require) {
    "use strict";

    var module = require("./module");

    var GOAT = function () {
        return this.init.apply(this, Array.prototype.slice.call(arguments));
    };

    GOAT.prototype = {
        _options: {},
        module: module,
        init: function (options) {
            console.log("GOAT:init");
            Object.keys(options || {}).forEach(function (key) {
                this._options[key] = options[key];
            }, this);
        }
    };

    return GOAT;

});

