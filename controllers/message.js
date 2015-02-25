"use strict";

var methods = {
    show: function error (request) {
        return {
            type: request.params.type
        };
    }
};

module.exports = methods;

