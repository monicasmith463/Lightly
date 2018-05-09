function initMap() {
  var myLatLng = {lat: 43.61295367682718, lng: -116.19129651919633 };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
  
}
