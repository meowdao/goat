"use strict";

import Q from "q";

var methods = {
    show: function message (request) {
        return Q({
            type: request.params.type
        });
    }
};

export default methods;

