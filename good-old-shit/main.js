require.config({
    "map": {
        "jquery.config": {
            "jquery": "jquery"
        },
        "*": {
            "jquery": "jquery.config",
            "jquery-ui/dialog": "jquery-ui/dialog.config",
            "jquery-ui/datepicker": "jquery-ui/datepicker.config"
        }
    },


    "shim": {
        "bootstrap": {
            deps: ["jquery"]
        }
    },

    "paths": {
        // plugins
        json: "/vendors/requirejs-plugins/src/json",
        text: "/vendors/requirejs-text/text",

        // your code
        "goat": "/js/goat",

        // 3rd party libs
        "jquery": "/vendors/jquery/dist/jquery",
        "jquery.config": "/js/configs/jquery",
        "jquery-ui": "/vendors/jquery-ui/ui",
        "jquery-ui/dialog.config": "/js/configs/jquery-ui.dialog.js",
        "jquery-ui/datepicker.config": "/js/configs/jquery-ui.datepicker.js",

        "bootstrap": "/vendors/bootstrap/dist/js/bootstrap"

    }
});

require([
    "goat/core",
    "bootstrap"
], function (goat) {
    "use strict";

    goat.module.sayHello();

});
