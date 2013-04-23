Globalize.getObject = function (parts, create, obj) {

	var key = parts, p;

	if (typeof parts === "string") {
		parts = parts.split(".");
	} else {
		key = parts.join(".");
	}

	if (create !== true || create !== false) {
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

	lang: localStorage.getItem("defaultLanguage"),

	init: function (lang) {

		var languages;

		if (localStorage.getItem("supportCompression") === "false") {
			languages = JSON.parse(localStorage.getItem("availableLanguages"));

			$.each(languages, function (i, e) {
				$.ajax({
					async: false,
					url: "/javascript/cultures/globalize.culture." + e + ".js",
					dataType: "script"
				});
			});
		}

		if (lang) {
			localStorage.setItem("defaultLanguage", lang);
			this.lang = lang;
		}

		Globalize.culture(this.lang);
		this.fixCSS();
	},

	translate: function (scope) {
		var obj = this;
		scope.find("[data-translation]").each(function () {
			var self = $(this),
				key = self.data("translation"),
				translation = obj.resolveKey(key);
			self.text(translation);
		});

		scope.find("[data-placeholder]").each(function () {
			var self = $(this),
				key = self.data("placeholder"),
				translation = obj.resolveKey(key);
			self.attr({placeholder: translation});
		});
		this.fixCSS();
	},

	resolveKey: function (key, locale) {
		return Globalize.localize(key, locale);
	},

	fixCSS: function () {
		var rtl = $("[href$=rtl\\.css]"),
			lang = $("[href$=lang\\.css]"),
			html = $("html");

		this.fixCSS = function () {
			html.attr({lang: this.lang});
			lang.prop("disabled", true).prop("disabled", false); // reload
			if (localStorage.getItem("supportRTL") === "true") {
				rtl.prop("disabled", !Globalize.culture().isRTL);
			}
		};

		this.fixCSS();
	}
};