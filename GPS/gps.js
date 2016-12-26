/* jslint browser:true */
//Global Variables
var id = null;
var firstTime = -1;
var i = 0;
var currentCache = 0;
var loc1 = {lat : 480, lon : 295, desc : "Student Center"};
var loc2 = {lat : 535, lon : 470, desc : "TEL Building"};
var loc3 = {lat : 305, lon : 350, desc : "Scott Library"};
var caches = new Array();
caches[0] = loc1;
caches[1] = loc2;
caches[2] = loc3;

//Funtions
function togglegps() {
    var button = document.getElementById("togglegps");
    if (navigator.geolocation) {
        if (id === null) {
            id = navigator.geolocation.watchPosition(showPosition, handleError, {enableHighAccuracy : true, timeout: 1000});
            button.innerHTML = "STOP GPS";
            firstTime = -1;
        } else {
            navigator.geolocation.clearWatch(id);
            id = null;
            button.innerHTML = "START GPS";
        }
    } else {
        alert("NO GPS AVAILABLE");
    }
}

function handleError(error) {
    var errorstr = "Really unknown error";
    switch (error.code) {
    case error.PERMISSION_DENIED:
        errorstr = "Permission deined";
        break;
    case error.POSITION_UNAVAILABLE:
        errorstr = "Permission unavailable";
        break;
    case error.TIMEOUT:
        errorstr = "Timeout";
        break;
    case error.UNKNOWN_ERROR:
        error = "Unknown error";
        break;
    }
    alert("GPS error " + error);
}

function interpolate(gps1, gps2, u1, u2, gps) {
    return u1 + (u2 - u1) * (gps - gps1) / (gps2 - gps1);
}

function showPosition(position) {
    var latitude = document.getElementById("latitude");
    var longitude = document.getElementById("longitude");
    var now = document.getElementById("now");

    latitude.innerHTML = position.coords.latitude;
    longitude.innerHTML = position.coords.longitude;
    if (firstTime < 0) {
      firstTime = position.timestamp;
    }
    now.innerHTML = position.timestamp - firstTime;

    var debug = document.getElementById("debug");
    var u = interpolate(43.772904, 43.774405, 210, 545, position.coords.latitude);
    var v = interpolate(-79.507769, -79.501144, 295, 296, position.coords.longitude);
    debug.innerHTML = u + " " + v;

    var me = document.getElementById("me");
    me.style.top = v;
    me.style.left = u;
}

function updateCache() {
  if (i < caches.length) {
    currentCache = caches[i];
    showCache();
    i++;
  }
}

function showCache() {
  var target = document.getElementById("target");
  target.style.left = currentCache.lat;
  target.style.top = currentCache.lon;
}
