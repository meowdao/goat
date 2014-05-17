require.config({
    baseUrl : "assets/js",

    shim: {
        "jQuery": {
            exports: "jQuery"
        },
        "Globalize": {
            exports: "Globalize",
            deps: ["cldr"]
        },
        "Translator": {
            deps: ["json", "text", "jQuery", "Globalize"]
        }
    },

    map: {
        "Globalize": {
            "globalize": "Globalize"
        }
    },

    paths: {
        // plugins
        json: "/vendors/requirejs-plugins/src/json",
        text: "/vendors/requirejs-text/text",

        // your code
        "GOAT": "goat/core",
        "Translator": "translator",

        // 3rd party libs
        "jQuery": "/vendors/jquery/dist/jquery",
        "jQuery-UI": "/vendors/jquery-ui/ui",
        "Globalize": "/vendors/globalize/dist/globalize",

        // i18n
        "cldr": "/vendors/cldrjs/dist/cldr",
        "i18n": "i18n"

    }
});

require([
        "GOAT", "jQuery", "Translator"
    ],
    function (GOAT, jQuery, Translator) {
        "use strict";

        var goat = new GOAT();
        goat.module.sayHello();

        var i18n = new Translator();

        jQuery.noConflict();
        jQuery(function () {
            i18n.translate("body");
        });

    });
