"use strict";

import Q from "q";
import _ from "lodash";

import UserAbstractController from "./user.abstract.js";

var methods = {
    profile: function user_profile(request) {
        return Q({
            user: request.user
        });
    }
};

export default _.extend(UserAbstractController, methods);
