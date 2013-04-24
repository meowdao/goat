"use strict";

var i18n = window.i18n = new Translator();

function showPopup(header, text, buttons) {
	if (jQuery.mobile) {
		jQuery("<div/>", {
			"class": "dispatch-popup",
			append: [
				jQuery("<h2/>", {text: header}),
				jQuery("<p/>", {text: text}),
				jQuery("<div/>", {
					"class": "ui-grid-" + ["0", "0", "a", "b", "c", "d", "e"][buttons.length],
					append: jQuery.map(buttons, function (button, index) {
						return jQuery("<div/>", {
							"class": "ui-block-" + ["a", "b", "c", "d", "e"][index],
							append: jQuery("<a/>", button).button()
						});
					})
				})
			]
		}).popup().on("popupafterclose", function () {
				jQuery(this).popup("destroy");
		}).popup("open");
	} else if (jQuery.ui) {
		jQuery("<div/>", {
			append: jQuery("<p/>", {text: text})
		}).dialog({
				title: header,
				autoOpen: true,
				buttons: buttons,
				close: function () {
					jQuery(this).dialog("destroy");
				}
			});
	} else {
		window.alert(text);
	}
}

function showError(error) {
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

jQuery.ajaxSetup({
	type: "post",
	dataType: "json",
	cache: false,
	author: "\x63\x74\x61\x70\x62\x69\x75\x6D\x61\x62\x70\x40\x67\x6D\x61\x69\x6C\x2E\x63\x6F\x6D"
});

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

if (jQuery.mobile) {
	// Turn off AJAX for local file browsing
	if ( location.protocol.substr(0,4)  === "file" ||
		location.protocol.substr(0,11) === "*-extension" ||
		location.protocol.substr(0,6)  === "widget" ) {

		// Start with links with only the trailing slash and that aren't external links
		var fixLinks = function() {
			jQuery("a[href$='/'], a[href='.'], a[href='..']").not("[rel='external']").each(function() {
				this.href = jQuery(this).attr("href").replace(/\/$/, "") + "/index.html";
			});
		};

		// fix the links for the initial page
		jQuery(fixLinks);

		// fix the links for subsequent ajax page loads
		jQuery(document).bind("pagecreate", fixLinks );

		// Check to see if ajax can be used. This does a quick ajax request and blocks the page until its done
		jQuery.ajax({
			url: ".",
			async: false,
			isLocal: true
		}).error(function() {
			// Ajax doesn't work so turn it off
			jQuery(document).bind("mobileinit", function() {
				jQuery.mobile.ajaxEnabled = false;
			});
		});
	}
}

jQuery.noConflict();
jQuery(function ($) {
	if ($.ui) {
		$.datepicker.setDefaults($.datepicker.regional[""]);
		widgetize();
	}
});



