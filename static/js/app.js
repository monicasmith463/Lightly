function initMap() {
//declare global variables
  let coords;
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
      coords = data.map( coord => {
        new google.maps.LatLng(coord[0], coord[1]);
      });
    })
  };


  function calculateRoutes(directionsService, directionsDisplay) {

    directionsService.route({
      origin: '414 N 1st St Boise, ID 83702',
      destination: '300 E Jefferson St #300 Boise, ID 83712',
      travelMode: 'WALKING',
      provideRouteAlternatives: true
    },

    function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {

          //boxRoutes returns the list of routes from the response, each item is [routeObject, [boxObjects]]
          let boxedRoutes = boxRoutes(response);
          let 


        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
  }

  function boxRoutes(response) {
    //iterate over API response routes and box them
    let boxedRoutes = [];
    for(let i=0; i<response.routes.length; i++) {
      var route = new google.maps.DirectionsRenderer({
        map: map,
        directions: response,
        routeIndex: i
      })
      let path = response.routes[i].overview_path;

      let boxes = routeBoxer.box(path, distance);
      //boxes are an array of nested tuples in format: ((lat0, lon0), (lat1, lon1), (lat2, lon2), (lat3, lon3))
      let boxpolys = boxes.map( box => {
        new google.maps.Rectangle({
          bounds: box,
          fillOpacity: 0,
          strokeOpacity: 1.0,
          strokeColor: '#000000',
          strokeWeight: 1,
          map: map
        })
      });
      boxedRoutes.push([route, boxpolys]);
    }
    return boxedRoutes;
  }

//first get coordinate data from AJAX call
getData();

//calculate routes
calculateRoutes(directionsService, directionsDisplay);

};
