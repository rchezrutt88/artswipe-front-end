'use strict';

let GoogleMapsLoader = require('google-maps');

GoogleMapsLoader.load(function(google) {
	new google.maps.Map(el, options);
});

GoogleMapsLoader.onLoad(function(google) {
	console.log('I just loaded google maps api');
});

console.log('fart');
