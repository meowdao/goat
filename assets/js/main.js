require.config({
    map: {
        "jquery.config": {
            "jquery": "jquery"
        },
        "*": {
            "jquery": "jquery.config",
            "jquery-ui/dialog": "jquery-ui/dialog.config",
            "jquery-ui/datepicker": "jquery-ui/datepicker.config"
        }
    },

    paths: {
        // plugins
        json: "/vendors/requirejs-plugins/src/json",
        text: "/vendors/requirejs-text/text",

        // your code
        "GOAT": "/js/goat",
        "translator": "/js/translator",

        // 3rd party libs
        "jquery": "/vendors/jquery/dist/jquery",
        "jquery.config": "/js/configs/jquery.config",
        "jquery-ui": "/vendors/jquery-ui/ui",
        "jquery-ui/dialog.config": "/js/configs/jquery-ui.dialog.config.js",
        "jquery-ui/datepicker.config": "/js/configs/jquery-ui.datepicker.config.js",
        "globalize": "/vendors/globalize/dist/globalize",

        // i18n
        "cldr": "/vendors/cldrjs/dist/cldr"

    }
});

require([
    "GOAT/core",
    "jquery",
    "translator",
    "cldr/unresolved"
], function (GOAT, $, i18n) {
    "use strict";

    var goat = new GOAT();
    goat.module.sayHello();

    $(function () {
        i18n.translate("body");
    });

});
