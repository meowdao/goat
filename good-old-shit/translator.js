define([
    "jquery",
    "globalize",

    "json!cldr-data/main/en/ca-gregorian.json",
    "json!cldr-data/main/en/numbers.json",
    "json!cldr-data/supplemental/likelySubtags.json",
    "json!cldr-data/supplemental/plurals.json",
    "json!cldr-data/supplemental/timeData.json",
    "json!cldr-data/supplemental/weekData.json",

    "json!i18n/ru.json",
    "json!i18n/en.json",

    "cldr/unresolved",

    "globalize/date",
    "globalize/number",
    "globalize/message"
], function ($, globalize, enGregorian, enNumbers, likelySubtags, pluralsData, timeData, weekData, ru, en) {
    "use strict";

    globalize.load(enGregorian, enNumbers, likelySubtags, pluralsData, timeData, weekData);

    globalize.loadTranslations(ru);
    globalize.loadTranslations(en);

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