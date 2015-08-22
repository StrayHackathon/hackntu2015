hospitals = [
{
	name: "aaa",
	address: "台北市辛亥路二段157號"
},
{
	name: "bbb",
	address: "台北市辛亥路二段300號"
},
{
	name: "ccc",
	address: "台北市辛亥路一段20號"
},
{
	name: "ddd",
	address: "台北市汀州路三段100號"
},
{
	name: "eee",
	address: "高雄市凱旋三路1號"
}
];

// center the map on current location of the user
function centerOnCurrentLocation(map) {
	// http://stackoverflow.com/questions/17382128/google-maps-api-center-map-on-clients-current-location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);
		});
	}
	else {
		alert("Your browser is not supported.");
	}
}

// initilaize Google Map
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: {lat: 25.03, lng: 121.30}
	});
	centerOnCurrentLocation(map);
	window.map = map;
}

// query GeoCode of the specified address and call callback() after it's finished.
function getGeoCode(map, addr, callback) {
	var gc = new google.maps.Geocoder();
	gc.geocode({address: addr}, function(results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			var n = results.length;
			for(var i = 0; i < n; ++i) {
				console.log(results[i]);
				var pt = results[i].geometry.location;
				callback({lat: pt.lat(), lng: pt.lng()});
			}
		}
	});
}

// add a mark for the address on the map
function markAddress(map, address) {
	getGeoCode(map, address, function(pos) {
	  var marker = new google.maps.Marker({
		position: pos,
		map: map /*,
		icon: image */
	  });
  });
}

function markSites(map, sites) {
	var n = sites.length;
	for(var i = 0; i < n; ++i) {
		var site = sites[i];
		markAddress(map, site.address);
	}
}
