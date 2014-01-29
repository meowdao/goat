"use strict";

var methods = {
    show: function message (request) {
        return {
            type: request.params.type
        };
    }
};

module.exports = methods;

