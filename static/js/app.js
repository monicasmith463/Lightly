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
    $.get('/coordinate-data', function( data ) {
        //set global coords variable to array of LatLngs for mapping
        // var coords = data.map( coord => {
        //   new google.maps.LatLng(coord[0], coord[1]);
        // });
        // let tester = new google.maps.LatLng(data[0][0], data[0][1]);
        // console.log("inside get Data: ", tester, tester.lat, tester.lng);
        //calculate routes
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
          console.log("TEST!!!");
          //boxRoutes returns the list of routes from the response, each item is [routeObject, [boxObjects]]
          let bestRoute = getBestRoute(response, coordinates);
          console.log(bestRoute);
          // let userRoute = searchArea(boxedRoutes, coords=coords);


        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
  }

  function getBestRoute(response, coordinates) {
    //iterate over API response routes and box them
    let boxedRoutes = boxRoutes(response);
    boxedRoutes.forEach( boxedRoute => {
      console.log("Inside get best route: ", boxedRoute);
    })
    return searchArea(boxedRoutes, coordinates);
  }

  function boxRoutes(response) {
    //iterate over API response routes and box them
    let boxedRoutes = [];
    for(let i=0; i<response.routes.length; i++) {
    //   var route = new google.maps.DirectionsRenderer({
    //     map: map,
    //     directions: response,
    //     routeIndex: i
    //   })
      let path = response.routes[i].overview_path;

      let boxes = routeBoxer.box(path, distance);
      console.log('boxes: ', boxes);
      //boxes are an array of nested tuples in format: ((lat0, lon0), (lat1, lon1), (lat2, lon2), (lat3, lon3))
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
    console.log("inside box routes: ", boxedRoutes);
    return boxedRoutes;
  }

function searchArea(boxedRoutes, coordinates) {
  //search over routes and determine which is best-lit
  let bestLightCount = 0;
  let bestRoute = boxedRoutes[0];
  let lightCount = 0;
  console.log("inside search: ", coordinates);
  for(var x=0; x<coordinates.length; x++) {
    let position = new google.maps.LatLng(coordinates[x][0], coordinates[x][1]);
    for(var i=0; i<boxedRoutes.length; i++) {
      for(var j=0; j<boxedRoutes[i].length; j++) {

        if( boxedRoutes[i][j] && boxedRoutes[i][j].getBounds().contains(position) ) {
          console.log("boxedRoutes[i][j]: ", boxedRoutes[i][j]);
          lightCount = lightCount + 1;
          console.log("light count: ", lightCount);
        }
      }
      if(lightCount > bestLightCount) {
        bestRouteIndex = i;
        bestLightCount = lightCount;
        console.log("best light count :", bestLightCount);
      }

    }
    lightCount = 0;

  }

  // boxedRoutes.forEach( boxedRoute => {
  //   if boxedRoute[0]
  // })
  return [bestRouteIndex, bestLightCount];
};

//first get coordinate data from AJAX call
getData();



};
