define(function (require) {
    "use strict";

    var i18n = require("globalize");

    return {
        sayHello: function(){
            console.log(i18n.translate("test/hello_world"));
        }
    };
});