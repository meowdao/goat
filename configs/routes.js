"use strict";

import messager from "../utils/messager.js";

module.exports = function (app, passport) {

    function createRegExpParameter(re){
        return function(request, response, next, val, name){
            var captures;
            if (captures = re.exec(String(val))) {
                request.params[name] = captures;
                next();
            } else {
                next(messager.makeError("invalid-param", request.user));
            }
        };
    }

    app.param("id", createRegExpParameter(/^[0-9a-z]{24}$/));

    require("../routes/index.js")(app);
    require("../routes/message.js")(app);
    require("../routes/opt_out.js")(app);
    require("../routes/user.js")(app);
    require("../routes/user.abstract.js")(app, passport);

};
