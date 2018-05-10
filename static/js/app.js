$( document ).ready(function() {

// function initMap() {
  var coords;

  function getData() {
    $.get('/coordinate-data', function( data ) {
      // $( ".result" ).html( data );
      alert( "Load was performed." );
      mapCoords(data);

    });
  }

  // var myLatLng = {lat: 43.61295367682718, lng: -116.19129651919633 };
  //
  // var map = new google.maps.Map(document.getElementById('map'), {
  //   zoom: 4,
  //   center: myLatLng
  // });
function mapCoords(coords) {
  coords.forEach( coord => {
    console.log(coord[0], coord[1], typeof(coord[0]));
    // var marker = new google.maps.Marker({
    //   position: {lat: coord[0] lng: coord[1] }
    //   map: map,
    //   title: 'Hello World!'
    // })
  });

}

getData();
// mapCoords(coords);



//
// };

});
