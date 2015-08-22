var hospitals = [
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

var parks = [];
var restaurants = [];
var friends = [];

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

// move current view to the specified address
function moveToAddress(map, address) {
	getGeoCode(map, address, function(pos) {
		map.setCenter(pos);
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

var tracked_path = null;
var tracking_id = -1;

function locationChanged(pos) {
	var crd = pos.coords;
	// FIXME: store current time
	tracked_path.push(crd);
}

function trackingError(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
}

function startTrackingPath() {
	if(tracking_id == -1) {
		if( navigator.geolocation) {
			var options = {
			  enableHighAccuracy: true,
			  timeout: 5000,
			  maximumAge: 0
			};
			tracking_id = navigator.geolocation.watchPosition(locationChanged, trackingError, options);
			tracked_path = new Array();
		}
		else {
			alert("your browser is not supported.");
		}
	}
}

function stopTrackingPath() {
	if( navigator.geolocation) {
		if(tracking_id != -1) {
			navigator.geolocation.clearWatch(tracking_id);
			tracking_id = -1;
		}
	}
	return tracked_path;
}
