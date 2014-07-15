define(function (require) {
    "use strict";

    var $ = require("jquery");
    var globalize = require("globalize");

    require("cldr/unresolved");

    require("globalize/date");
    require("globalize/number");
    require("globalize/message");

    globalize.load(require("json!cldr/main/en/ca-gregorian.json"));
    globalize.load(require("json!cldr/main/en/numbers.json"));
    globalize.load(require("json!cldr/supplemental/likelySubtags.json"));
    globalize.load(require("json!cldr/supplemental/timeData.json"));
    globalize.load(require("json!cldr/supplemental/weekData.json"));

    globalize.loadTranslations(require("json!i18n/en.json"));
    globalize.loadTranslations(require("json!i18n/ru.json"));

    var Translator = function () {
        this.setLang.apply(this, arguments);
    };

    Translator.prototype = {

        // TODO add cookies support
        lang: localStorage.getItem("defaultLanguage") || "en-US",

        setLang: function (lang) {

            if (["ru-RU", "en-US"].indexOf(lang) !== -1) {
                this.lang = lang;
            }

            localStorage.setItem("defaultLanguage", this.lang);
            globalize.locale(this.lang);
            this.fixCSS();
        },

        translate: function (scope) {
            var $scope = $(scope);
            $scope.find("[data-translation]").each(function () {
                var self = $(this);
                self.text(globalize.translate(self.data("translation")));
            });

            $scope.find("[data-placeholder]").each(function () {
                var self = $(this);
                self.attr({placeholder: globalize.translate(self.data("placeholder"))});
            });
            this.fixCSS();
        },

        fixCSS: function () {
            $("html").attr({lang: this.lang});
            //$("[href$=lang\\.css]").prop("disabled", true).prop("disabled", false); // reload
            //$("[href$=rtl\\.css]").prop("disabled", !globalize.culture().isRTL);
        }
    };

    return new Translator();
});