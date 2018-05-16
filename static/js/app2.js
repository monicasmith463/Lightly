function initMap() {
  var myPosition = new google.maps.LatLng(46.0, -125.9);

  var mapOptions = {
    zoom: 5,
    center: myPosition,
    mapTypeId: 'terrain'
  };

  var map = new google.maps.Map(document.getElementById('map'),
      mapOptions);

  var cascadiaFault = new google.maps.Polyline({
    path: [
      new google.maps.LatLng(49.95, -128.1),
      new google.maps.LatLng(46.26, -126.3),
      new google.maps.LatLng(40.3, -125.4)
    ]
  });

  var marker = new google.maps.Marker({
    position: myPosition,
    map: map,
    title: 'streetlight'
  });

  cascadiaFault.setMap(map);

  if (google.maps.geometry.poly.isLocationOnEdge(myPosition, cascadiaFault, 10e-30)) {
    alert("Relocate!");
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
