function MyControl() {
	this.div = document.createElement('DIV');
	this.div.style.backgroundColor = "#fff";
	this.div.style.border = "1px solid #000";
	this.div.style.padding = "10px";
	this.div.style.marginTop = "25px";
	this.div.appendChild(document.createTextNode("Click on map"));
}

MyControl.prototype = {
	getDiv: function () {
		return this.div;
	},
	remove: function () {
		this.div.parentNode.removeChild(this.div);
	}
};

google.maps.event.addDomListener(window, "load", function () {

	"use strict";

	var map, my, marker;

	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 3,
		disableDefaultUI: true,
		center: new google.maps.LatLng(0, 0),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	my = new MyControl();
	map.controls[google.maps.ControlPosition.TOP].push(my.getDiv());

	marker = new google.maps.Marker({
		map: map
	});

	google.maps.event.addListener(map, 'click', function (e) {
		jQuery.ajax({
			url: "http://www.earthtools.org/timezone/" + e.latLng.lat() + "/" + e.latLng.lng(),
			type: "get",
			dataType: "xml",
			success: function (data) {
				my.getDiv().innerText = "Local time is: " + jQuery(data).find("isotime").text();
				marker.setPosition(e.latLng);
				map.panTo(e.latLng);
			}
		});

	});

});