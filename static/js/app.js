function initMap() {

  var coords;
  var distance = 0.02; // in km

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;


  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center:  {lat: 43.61295367682718, lng: -116.19129651919633 }
  });


  directionsDisplay.setMap(map);


  function calculateAndDisplayRoute(directionsService, directionsDisplay) {

    directionsService.route({
      origin: '414 N 1st St Boise, ID 83702',
      destination: '300 E Jefferson St #300 Boise, ID 83712',
      travelMode: 'WALKING',
      provideRouteAlternatives: true
    },

    function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {

          // // Box the overview path of the first route
          // var path = response.routes[0].overview_path;
          // var boxes = routeBoxer.box(path, distance);
          //
          // for (var i = 0; i < boxes.length; i++) {
          //   var bounds = boxes[i];
          //   console.log("bounds: " + bounds);
          //   // searchArea(bounds);
          //   // Perform search over this bounds
          // }

          for (var i = 0; i < response.routes.length; i++) {
            console.log(response);
            route = new google.maps.DirectionsRenderer({
              map: map,
              directions: response,
              routeIndex: i
            });

            // polyline = google.maps.geometry.encoding.decodePath(response.routes[i].overview_polyline);
            polyline = new google.maps.Polyline({
              path: response.routes[i].overview_polyline
            });
            //encoded polyline

            polyline.setMap(map);
            findNearbyLights(polyline, coords=coords);
          }

        } else {
          window.alert('Directions request failed due to ' + status);
        }
    });

    // directionsService.route({
    //   origin: '4821 W Franklin St Boise, ID 83705',
    //   destination: '4204 W Overland Rd Boise, ID 83705',
    //   travelMode: 'WALKING',
    //   provideRouteAlternatives: true
    // }, function(response, status) {
    //   console.log(response);
    //   if (status === 'OK') {
    //
    //     // directionsDisplay.setDirections(response);
    //   } else {
    //     window.alert('Directions request failed due to ' + status);
    //   }
    // });
  }


  // function searchArea(boxes) {
  //   // boundedLights = [];
  //   // boxes.forEach( box => {
  //   //   box.forEach( bounds => {
  //   //     if(bounds[0] && bounds[1])
  //   //   })
  //   // })
  // }

  function getData() {
    $.get('/coordinate-data', function( data ) {
      // $( ".result" ).html( data );
      alert( "Load was performed." );
      coords = data;
      mapCoords(data);

    });
  }

function mapCoords(coords) {
  boundedCoords = coords.filter(coord => (
    (coord[0] > 43.61295367682718) && (coord[1] > -116.19129651919633)

  ))
  // boundedCoords.forEach( coord => {
  //   var marker = new google.maps.Marker({
  //     position: {lat: coord[0], lng: coord[1] },
  //     map: map,
  //     title: 'streetlight'
  //   });

    // var lightPool = new google.maps.Circle({
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: '#FF0000',
    //   fillOpacity: 0.35,
    //   map: map,
    //   center: marker.position,
    //   radius: 10
    // });



  // for(var i=0; i<1000; i++) {
  //
  //   var marker = new google.maps.Marker({
  //     position: {lat: coords[i][0], lng: coords[i][1] },
  //     map: map,
  //     title: 'streetlight'
  //   });


       // Add the circle for this city to the map.

     // var lightPool = new google.maps.Circle({
     //   strokeColor: '#FF0000',
     //   strokeOpacity: 0.8,
     //   strokeWeight: 2,
     //   fillColor: '#FF0000',
     //   fillOpacity: 0.35,
     //   map: map,
     //   center: marker.position,
     //   radius: 20
     // });
  // };
  calculateAndDisplayRoute(directionsService, directionsDisplay);
};


function findNearbyLights(polyline, coords=coords) {
  console.log("polyline: ", polyline);
  coords.forEach(coord => {

    var marker = new google.maps.Marker({
      position: { lat: coord[0], lng: coord[1] },
      map: map,
      title: 'streetlight'
    });

    var lightPosition = new google.maps.LatLng(coord[0], coord[1]);
    console.log("coordinates: ", coord[0], coord[1] );
    console.log("light position: ", lightPosition);
     // Add the circle for this city to the map.
    var cascadiaFault = new google.maps.Polyline({
    path: [
      new google.maps.LatLng(49.95, -128.1),
      new google.maps.LatLng(46.26, -126.3),
      new google.maps.LatLng(40.3, -125.4)
    ]
    });

    let test = google.maps.geometry.poly.containsLocation(lightPosition, polyline);
    console.log(test);

     if( test ) {
       console.log("I'm Working!");
       // var lightPool = new google.maps.Circle({
       //   strokeColor: '#FF0000',
       //   strokeOpacity: 0.8,
       //   strokeWeight: 2,
       //   fillColor: '#FF0000',
       //   fillOpacity: 0.35,
       //   map: map,
       //   center: marker.position,
       //   radius: 20
       // });
     }
  });

}

getData();




};

// });
