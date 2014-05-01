"use strict";

(function (callback) {
	if (!(
		window.jQuery &&     // does site already have jQuery
			jQuery.fn.on &&  // is it >= 1.7.0
			jQuery.ajax      // is it supports ajax
		)) {
		var scriptList = document.getElementsByTagName("script"),
			currentScript = scriptList[scriptList.length - 1],
			script = document.createElement("script"),
			done = false;
		script.src = "jquery.min.js";
		script.onload = script.onreadystatechange = function () {
			if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
				done = true;
				callback();
				script.onload = script.onreadystatechange = null;
				//currentScript.parentNode.removeChild(script);
			}
		};
		currentScript.parentNode.insertBefore(script, currentScript);
	} else {
		callback();
	}
})(function () {
	var $ = jQuery.noConflict();
	$(function () {
		// do nothing
	});
});