"use strict";

Globalize.getObject = function (parts, create, obj) {

	var key = parts, p;

	if (typeof parts === "string") {
		parts = parts.split(".");
	} else {
		key = parts.join(".");
	}

	if (typeof create !== "boolean") {
		obj = create;
		create = undefined;
	}

	obj = obj || window;

	while (obj && parts.length) {
		p = parts.shift();
		if (obj[p] === undefined && create) {
			obj[p] = {};
		}
		obj = obj[p];
	}

	return obj || "???" + key + "???";
};

Globalize.localize = function (key, cultureSelector) {
	return this.getObject(key, false, this.findClosestCulture(cultureSelector).messages) ||
		this.getObject(key, false, this.cultures[Translator.lang].messages);
};


var Translator = function () {
	this.init.apply(this, arguments);
};

Translator.prototype = {

	// TODO add cookies support
	lang: localStorage.getItem("defaultLanguage") || "en-US",

	init: function (lang) {

		if (Object.keys(Globalize.cultures).indexOf(lang) !== -1) {
			this.lang = lang;
		}

		localStorage.setItem("defaultLanguage", this.lang);
		Globalize.culture(this.lang);
		this.fixCSS();
	},

	translate: function (scope) {
		var obj = this;
		scope.find("[data-translation]").each(function () {
			var self = jQuery(this);
			self.text(obj.resolveKey(self.data("translation")));
		});

		scope.find("[data-placeholder]").each(function () {
			var self = jQuery(this);
			self.attr({placeholder: obj.resolveKey(self.data("placeholder"))});
		});
		this.fixCSS();
	},

	resolveKey: function (key, locale) {
		return Globalize.localize(key, locale);
	},

	fixCSS: function () {
		jQuery("html").attr({lang: this.lang});
		jQuery("[href$=lang\\.css]").prop("disabled", true).prop("disabled", false); // reload
		jQuery("[href$=rtl\\.css]").prop("disabled", !Globalize.culture().isRTL);
	}
};