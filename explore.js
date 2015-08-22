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

// convert TWD97 coordinates to LatLng used by Google Map
// http://kuro.tw/posts/2015/06/11/js-note-twd97-convert-to-longitude-and-latitude
function twd97_to_latlng($x, $y) {
  var pow = Math.pow, M_PI = Math.PI;
  var sin = Math.sin, cos = Math.cos, tan = Math.tan;
  var $a = 6378137.0, $b = 6356752.314245;
  var $lng0 = 121 * M_PI / 180, $k0 = 0.9999, $dx = 250000, $dy = 0;
  var $e = pow((1 - pow($b, 2) / pow($a, 2)), 0.5);

  $x -= $dx;
  $y -= $dy;

  var $M = $y / $k0;

  var $mu = $M / ($a * (1.0 - pow($e, 2) / 4.0 - 3 * pow($e, 4) / 64.0 - 5 * pow($e, 6) / 256.0));
  var $e1 = (1.0 - pow((1.0 - pow($e, 2)), 0.5)) / (1.0 + pow((1.0 - pow($e, 2)), 0.5));

  var $J1 = (3 * $e1 / 2 - 27 * pow($e1, 3) / 32.0);
  var $J2 = (21 * pow($e1, 2) / 16 - 55 * pow($e1, 4) / 32.0);
  var $J3 = (151 * pow($e1, 3) / 96.0);
  var $J4 = (1097 * pow($e1, 4) / 512.0);

  var $fp = $mu + $J1 * sin(2 * $mu) + $J2 * sin(4 * $mu) + $J3 * sin(6 * $mu) + $J4 * sin(8 * $mu);

  var $e2 = pow(($e * $a / $b), 2);
  var $C1 = pow($e2 * cos($fp), 2);
  var $T1 = pow(tan($fp), 2);
  var $R1 = $a * (1 - pow($e, 2)) / pow((1 - pow($e, 2) * pow(sin($fp), 2)), (3.0 / 2.0));
  var $N1 = $a / pow((1 - pow($e, 2) * pow(sin($fp), 2)), 0.5);

  var $D = $x / ($N1 * $k0);

  var $Q1 = $N1 * tan($fp) / $R1;
  var $Q2 = (pow($D, 2) / 2.0);
  var $Q3 = (5 + 3 * $T1 + 10 * $C1 - 4 * pow($C1, 2) - 9 * $e2) * pow($D, 4) / 24.0;
  var $Q4 = (61 + 90 * $T1 + 298 * $C1 + 45 * pow($T1, 2) - 3 * pow($C1, 2) - 252 * $e2) * pow($D, 6) / 720.0;
  var $lat = $fp - $Q1 * ($Q2 - $Q3 + $Q4);

  var $Q5 = $D;
  var $Q6 = (1 + 2 * $T1 + $C1) * pow($D, 3) / 6;
  var $Q7 = (5 - 2 * $C1 + 28 * $T1 - 3 * pow($C1, 2) + 8 * $e2 + 24 * pow($T1, 2)) * pow($D, 5) / 120.0;
  var $lng = $lng0 + ($Q5 - $Q6 + $Q7) / cos($fp);

  $lat = ($lat * 180) / M_PI;
  $lng = ($lng * 180) / M_PI;

  return {
    lat: $lat,
    lng: $lng
  };
}

// load data of hospitals
function loadHospitals() {
	$.getJSON("data/hospitals.json", function(data) {
		// the "pos" in the hospitals are in TWD97 format
		for(var i = 0; i < data.length; ++i) {
			var h = data[i];
			if(h.pos) {
				h.pos = twd97_to_latlng(h.pos[0], h.pos[1]);
				console.log(h.pos);
			}
		}
	});
}

// load data of parks in the city
function loadParks() {
	$.getJSON("data/parks.json", function(data) {
		
	});
}

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

/*	
	$.ajax({
		url: "data/hospitals_src.json",
		success: function(data, status) {
			alert(data.length);
		},
		dataType: "json"
	});
*/
}

// query GeoCode of the specified address and call callback() after it's finished.
function getGeoCode(map, addr, callback) {
	var gc = new google.maps.Geocoder();
	gc.geocode({address: addr}, function(results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			var pt = results[0].geometry.location;
			callback({lat: pt.lat(), lng: pt.lng()});
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
	tracked_path.push({lat: crd.latitude, lng: crd.longitude});
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
		// var crd = tracked_path[tracked_path.length - 1];
		// tracked_path.push({lat: crd.lat + 1.0, lng: crd.lng + 1.0});
	}
	return tracked_path;
}

function createPath(_path) {
	drawPath = new google.maps.Polyline({
		path: _path,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 8
	});
	return drawPath;
}
