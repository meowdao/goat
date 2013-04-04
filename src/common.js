var i18n = new Translator();

function showPopup(header, text, buttons) {
	"use strict";
	var $ = jQuery;

	if ($.mobile) {
		$("<div/>", {
			"class": "dispatch-popup",
			append: [
				$("<h2/>", {text: header}),
				$("<p/>", {text: text}),
				$("<div/>", {
					"class": "ui-grid-" + ["0", "0", "a", "b", "c", "d", "e"][buttons.length],
					append: $.map(buttons, function (button, index) {
						return $("<div/>", {
							"class": "ui-block-" + ["a", "b", "c", "d", "e"][index],
							append: $("<a/>", button).button()
						});
					})
				})
			]
		}).popup().on("popupafterclose", function () {
				$(this).popup("destroy");
			}).popup("open");
	} else if ($.ui) {
		$("<div/>", {
			append: $("<p/>", {text: text})
		}).dialog({
				title: header,
				autoOpen: true,
				buttons: buttons,
				close: function () {
					$(this).dialog("destroy");
				}
			});
	} else {
		alert(text);
	}
}

function showError(error) {
	"use strict";

	console.log(error);
	showPopup(i18n.resolveKey("common.error"), error, [{
		text: i18n.resolveKey("common.ok"),
		click: function () {
			if (jQuery.mobile) {
				jQuery(this).closest(".ui-popup").popup("close");
			} else if (jQuery.ui) {
				jQuery(this).dialog("close");
			}
		}
	}]);
}

function widgetize(context) {
	"use strict";
	context = context || document;
	jQuery("input[type=submit], input[type=reset], input[type=button], button, a[data-role=button]", context).button();
	jQuery("[data-role]", context).each(function () {
		var self = jQuery(this);
		self[self.data("role")](self.data("options"));
		self.removeAttr("data-role data-options");
	});
	if (jQuery.ui.selectmenu) {
		jQuery("select", context).each(function () {
			var self = jQuery(this);
			self.selectmenu(self.data("options"));
			self.removeAttr("data-role data-options");
		});
	}
}

jQuery(document)
	.ajaxStart(function () {
		jQuery(this).css({cursor: "wait"});
		if (jQuery.mobile) {
			jQuery.mobile.loading("show", {
				text: i18n.resolveKey("common.loading"),
				textVisible: true,
				theme: "a",
				html: ""
			});
		}
	})
	.ajaxError(function (event, XMLHttpRequest, ajaxOptions, thrownError) {
		console.log(document.location.protocol + "//" + document.location.host + "/" + ajaxOptions.url + "?" + (ajaxOptions.data || ""));
		console.log(thrownError);
		showError(thrownError);
	})
	.ajaxSuccess(function (event, XMLHttpRequest, ajaxOptions) {
		console.log(document.location.protocol + "//" + document.location.host + "/" + ajaxOptions.url + "?" + (ajaxOptions.data || ""));
	})
	.ajaxComplete(function () {
		jQuery(this).css({cursor: "auto"});
		if (jQuery.mobile) {
			jQuery.mobile.loading("hide");
		}
	});

if (jQuery.ui) {
	jQuery.extend(jQuery.ui.dialog.prototype.options, {
		modal: true,
		resizable: false,
		draggable: false,
		autoOpen: false,
		closeText: "Close"
	});
}

jQuery.noConflict();
jQuery(function ($) {
	"use strict";

	if ($.ui) {
		$.datepicker.setDefaults($.datepicker.regional['']);
		widgetize();
	}
});


