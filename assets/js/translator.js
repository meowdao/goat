define(function (require) {
    "use strict";

    var $ = require("jQuery");
    var Globalize = require("Globalize");
    require("Globalize/date");
    require("Globalize/number");
    require("Globalize/message");

    Globalize.load(require("json!cldr/main/en/ca-gregorian.json"));
    Globalize.load(require("json!cldr/main/en/numbers.json"));
    Globalize.load(require("json!cldr/supplemental/likelySubtags.json"));
    Globalize.load(require("json!cldr/supplemental/timeData.json"));
    Globalize.load(require("json!cldr/supplemental/weekData.json"));

    // http://stackoverflow.com/questions/19621586/load-locale-file-dynamically-using-requirejs
    Globalize.loadMessages("en-US", require("json!i18n/en-US.json"));
    Globalize.loadMessages("ru-RU", require("json!i18n/ru-RU.json"));

    var Translator = function () {
        this.init.apply(this, arguments);
    };

    Translator.prototype = {

        // TODO add cookies support
        lang: localStorage.getItem("defaultLanguage") || "en-US",

        init: function (lang) {

            if (["ru-RU", "en-US"].indexOf(lang) !== -1) {
                this.lang = lang;
            }

            localStorage.setItem("defaultLanguage", this.lang);
            Globalize.locale(this.lang);
            this.fixCSS();
        },

        translate: function (scope) {
            var $scope = $(scope);
            $scope.find("[data-translation]").each(function () {
                var self = $(this);
                self.text(Globalize.translate(self.data("translation")));
            });

            $scope.find("[data-placeholder]").each(function () {
                var self = $(this);
                self.attr({placeholder: Globalize.translate(self.data("placeholder"))});
            });
            this.fixCSS();
        },

        fixCSS: function () {
            $("html").attr({lang: this.lang});
            //$("[href$=lang\\.css]").prop("disabled", true).prop("disabled", false); // reload
            //$("[href$=rtl\\.css]").prop("disabled", !Globalize.culture().isRTL);
        }
    };

    return Translator;
});