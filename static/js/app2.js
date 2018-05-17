function initMap() {

  let coords;
  const distance = 0.01; // in km

  let routeRatings;

  const routeBoxer = new RouteBoxer();

  const directionsService = new google.maps.DirectionsService;
  const directionsDisplay = new google.maps.DirectionsRenderer;


  const map = new google.maps.Map(document.getElementById('map'), {
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

          // Box the overview path of the first route
          for(var i=0; i<response.routes.length; i++) {
            var route = new google.maps.DirectionsRenderer({
              map: map,
              directions: response,
              routeIndex: i
            })
            var path = response.routes[i].overview_path;

            let polyline = new google.maps.Polyline({
              path: response.routes[i].overview_path
            });

            polyline.setMap(map);
            var boxes = routeBoxer.box(path, distance);
            console.log("routeboxer boxes: "+  boxes);

            console.log("boxes: ", typeof boxes[0].b.b);
            let boxpolys = boxes.map( box => {
              new google.maps.Rectangle({
                bounds: box,
                fillOpacity: 0,
                strokeOpacity: 1.0,
                strokeColor: '#000000',
                strokeWeight: 1,
                map: map
              });
            })
            // drawBoxes(boxpolys);
            console.log("boxes: ", boxes); //array of nested tuples in format: ((lat0, lon0), (lat1, lon1), (lat2, lon2), (lat3, lon3))
            // searchArea(boxpolys, coords=coords);
          }


            // mapBox.setMap(map);
          // });

          // Perform search over each bounds





            // polyline = google.maps.geometry.encoding.decodePath(response.routes[i].overview_polyline);
            // let polyline = new google.maps.Polyline({
            //   path: response.routes[i].overview_path
            // });
            //encoded polyline

            // polyline.setMap(map);
            // findNearbyLights(polyline, coords=coords);


        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
    // });

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

  function drawBoxes(boxes) {
    // let boxpolys;
    // for (var i = 0; i < boxes.length; i++) {
    //   boxpolys[i] = new google.maps.Rectangle({
    //     bounds: boxes[i],
    //     fillOpacity: 0,
    //     strokeOpacity: 1.0,
    //     strokeColor: '#000000',
    //     strokeWeight: 1,
    //     map: map
    //   });
    //   console.log("boxpolys[i] : ", boxpolys[i].bounds)
    // }

    // let boxpolys = boxes.map( box => {
    //   new google.maps.Rectangle({
    //     bounds: box,
    //     fillOpacity: 0,
    //     strokeOpacity: 1.0,
    //     strokeColor: '#000000',
    //     strokeWeight: 1,
    //     map: map
    //   })
    // });

    // console.log("boxpolys: " + boxpolys);
    // searchArea(boxpolys, coords=coords);
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
      coords = data;
      console.log("coords0: ", coords[0][0][0]);
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



function searchArea(boxes, coords=coords) {

  coords.forEach( coord => {
    var position = new google.maps.LatLng(coord[0], coord[1]);
    console.log("position: ", position);
    // console.log(boxes);
    // var myBox = boxes[0];
    // if(myBox.getBounds().contains(position)) {
    //   console.log('Working');
    // } else {
    //   console.log('Not working');
    // }
    for(var i=0; i<boxes.length; i++) {
      console.log("box: ", boxes[i]);
      if( boxes[i] && boxes[i].getBounds().contains(position) ) {
        console.log("HI!!");
      }
    }



    // var myCoord = new google.maps.LatLng(43.61364486432118, -116.19343399330964);
    // console.log("Check get Bounds: " + myBox.getBounds().contains(myCoord));
    //
    // let test = google.maps.geometry.poly.containsLocation(position, myBox);
    // if( test ) {
    //
    // }

  })





  // var latLons = coords.map( coord => {
  //   new google.maps.LatLng(coord[0], coord[1]);
  // })
  // console.log(latLons);
  //
  // latLons.forEach( latLon => {
  //   console.log("latlong: " + latLon);
  //   boxes.forEach( box => {
  //     if(google.maps.geometry.poly.containsLocation(latLon, box)) {
  //       var marker = new google.maps.Marker({
  //         position: latLon,
  //         map: map,
  //         title: 'streetlight'
  //       });
  //     }
  //
  //   })
  // })


}

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
