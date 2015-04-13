"use strict";

import $ from "jquery";
import crypto from "crypto";

window.jQuery = $;

function readCookie(name) {
	var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
	return match ? decodeURIComponent(match[3]) : null;
}

$.ajaxSetup({
	type: "post",
	dataType: "json",
	cache: false,
	author: "\x63\x74\x61\x70\x62\x69\x75\x6D\x61\x62\x70\x40\x67\x6D\x61\x69\x6C\x2E\x63\x6F\x6D",
	headers: {
		"X-XSRF-TOKEN": readCookie("XSRF-TOKEN")
	}
});

$(document)
	.ajaxStart(function () {
		$(this).css({cursor: "wait"});
	})
	.ajaxError(function (event, XMLHttpRequest, ajaxOptions, thrownError) {
		console.info(document.location.protocol + "//" + document.location.host + "/" + ajaxOptions.url + "?" + (ajaxOptions.data || ""));
		console.error(thrownError);
	})
	.ajaxSuccess(function (event, XMLHttpRequest, ajaxOptions) {
		console.info(document.location.protocol + "//" + document.location.host + "/" + ajaxOptions.url + "?" + (ajaxOptions.data || ""));
	})
	.ajaxComplete(function () {
		$(this).css({cursor: "auto"});
	});

export default $