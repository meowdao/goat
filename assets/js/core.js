"use strict";

var GOAT = function () {
    return this.init.apply(this, Array.prototype.slice.call(arguments));
};

GOAT.prototype = {
    _options: {},
    init: function (options) {
        Object.keys(options || {}).forEach(function (key) {
            this._options[key] = options[key];
        }, this);
    }
};

window.GOAT = GOAT;

