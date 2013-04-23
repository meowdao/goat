google.maps.event.addDomListener(window, "load", function () {

	"use strict";

	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 13,
		center: new google.maps.LatLng(0, 0),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var watchId;

	if (!!navigator.geolocation) {
		watchId = navigator.geolocation.watchPosition(geo_success, geo_error, {
			enableHighAccuracy: true,
			maximumAge: 30000,
			timeout: 5000
		});
	} else {
		showError(i18n.resolveKey("geo.unavailable"));
	}

	function geo_success(position) {
		map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
	}

	function geo_error(error) {
		showError(i18n.resolveKey("geo.error." + error.code));
		navigator.geolocation.clearWatch(watchId);
	}

});