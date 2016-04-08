'use strict';

let GoogleMapsLoader = require('google-maps');
let myApp = require('./myApp')

let map;
let geocoder;
let BOSTON;
let currentLocation;


GoogleMapsLoader.KEY = myApp.GM_API_KEY;
GoogleMapsLoader.REGION = 'EU';
GoogleMapsLoader.LIBRARIES = ['geometry'];

let initializeMap = function() {
  GoogleMapsLoader.load(function(google) {
    map = new google.maps.Map($("#map")[0], {
      center: {
        lat: 42.3386,
        lng: -71.0941
      },
      zoom: 15,
    });
    geocoder = new google.maps.Geocoder();
  });
};

GoogleMapsLoader.onLoad(function(google) {
  console.log('I just loaded google maps api');
  BOSTON = new google.maps.LatLng({
    lat: 42.2129,
    lng: -71.0349
  });

});

navigator.geolocation.getCurrentPosition(function(position) {
  map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
  currentLocation = new google.maps.LatLng({
    lat: position.coords.latitude,
    lng: position.coords.longitude
  });
});

let codeAddress = function(address) {
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      setDistance(Math.round((getMiles(google.maps.geometry.spherical.computeDistanceBetween(currentLocation || BOSTON, results[0].geometry.location)))));
      map.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });
};

let getMiles = function(i) {
  return i * 0.000621371192;
};

let setDistance = function(distance) {
  $("#distance").text(distance + " miles away");
}




module.exports = {
  initializeMap,
  codeAddress,
}
