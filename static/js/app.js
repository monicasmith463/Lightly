function initMap() {
//declare global variables
  // let coords = null;
  const distance = 0.01; // in km
//route ratings: array for storing the ratings for each route
  let routeRatings;

//instatiate routeBoxer from the library for boxing in route
  const routeBoxer = new RouteBoxer();

//set up directions Service and directions display
  const directionsService = new google.maps.DirectionsService;
  const directionsDisplay = new google.maps.DirectionsRenderer;

//create a new map object centered around Boise
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center:  {lat: 43.61295367682718, lng: -116.19129651919633 }
  });

//set the map on the directions display
  directionsDisplay.setMap(map);

  function getData() {
    $.get('/coordinate-data', function(data) {
        calculateRoutes(directionsService, directionsDisplay, coordinates=data);
    })
  };


  function calculateRoutes(directionsService, directionsDisplay, coordinates) {
    console.log("Inside calculate routes: ", coordinates);
    directionsService.route({
      origin: '414 N 1st St Boise, ID 83702',
      destination: '300 E Jefferson St #300 Boise, ID 83712',
      travelMode: 'WALKING',
      provideRouteAlternatives: true
    },

    function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          //boxRoutes returns the list of routes from the response, each item is [routeObject, [boxObjects]]
          let lightCounts = getLightCounts(response, coordinates);
          var route = new google.maps.DirectionsRenderer({
            map: map,
            directions: response,
            routeIndex: lightCounts[0]
          });

        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
  }

  function getLightCounts(response, coordinates) {
    //iterate over API response routes and box them
    let boxedRoutes = boxRoutes(response);
    // boxedRoutes.forEach( boxedRoute => {
    //
    // })
    return searchAreas(boxedRoutes, coordinates);
  }

  function boxRoutes(response) {
    //iterate over API response routes and box them
    let boxedRoutes = [];
    for(let i=0; i<response.routes.length; i++) {
      let path = response.routes[i].overview_path;

      //routeBoxer returns an array of four tuples, the bounds of a rectangle
      let boxes = routeBoxer.box(path, distance);
      let boxpolys = [];
      boxes.forEach( box => {
        let newBox = new google.maps.Rectangle({
          bounds: box,
          fillOpacity: 0,
          strokeOpacity: 1.0,
          strokeColor: '#000000',
          strokeWeight: 1,
          map: map
        });
        boxpolys.push(newBox);
      });
      boxedRoutes.push(boxpolys);
    }
    return boxedRoutes;
  }

function searchAreas(boxedRoutes, coordinates) {
  //search over routes and return light count for each as an array
  let lightCounts = [];
  for(var i=0; i<boxedRoutes.length; i++) {
    let lightCount = 0;
    boxedRoutes[i].forEach( box => {
      coordinates.forEach( coordinate => {
        let position = new google.maps.LatLng(coordinate[0], coordinate[1]);
        if(box && box.getBounds().contains(position)) {
          lightCount += 1;
        }
      })
    })
    lightCounts.push(lightCount);
  }

  return lightCounts;
};

//first get coordinate data from AJAX call
getData();



};
