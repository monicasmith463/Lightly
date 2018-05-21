function initMap() {
  //set up autocomplete
  // var card = document.getElementById('pac-card');
  // var input = document.getElementById('pac-input');
  // var types = document.getElementById('type-selector');
  // var strictBounds = document.getElementById('strict-bounds-selector');

  //set up directions Service and directions display
  const directionsService = new google.maps.DirectionsService;
  const directionsDisplay = new google.maps.DirectionsRenderer;

  //create a new map object centered around Boise
  const map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    zoom: 4,
    center:  {lat: 43.61295367682718, lng: -116.19129651919633 }
  });

  //set the map on the directions display
  directionsDisplay.setMap(map);


// perform route calulation and routing based on light density along routes

  const distance = 0.01; // distance from route for box converage in km.
  //route ratings: array for storing the ratings for each route
  let routeRatings;

//instatiate routeBoxer from the library for boxing in route
  const routeBoxer = new RouteBoxer();

  function getData() {
    $.get('/coordinate-data', function(data) {
        calculateRoutes(directionsService, directionsDisplay, coordinates=data);
    })
  };


  function calculateRoutes(directionsService, directionsDisplay, coordinates) {

    directionsService.route({
      origin: 'Action Windows, 1227 S Colorado Ave, Boise, ID 83706',
      destination: '709 W Beacon St, Boise, ID 83706',
      travelMode: 'WALKING',
      provideRouteAlternatives: true
    },

    function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
           //if only one route is returned default to route index 0
          let bestRouteIndex = 0;
          if(response.routes.length > 1) {
            let lightCounts = getLightCounts(response, coordinates);
            bestRouteIndex = getBestRoute(response, lightCounts);
          }
          var route = new google.maps.DirectionsRenderer({
            map: map,
            directions: response,
            routeIndex: bestRouteIndex
          });
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
  }

  function getLightCounts(response, coordinates) {
    //iterate over API response routes and box them
    //boxRoutes returns the list of routes from the response, each item is [routeObject, [boxObjects]]
    let boxedRoutes = boxRoutes(response);
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

function getBestRoute(response, lightCounts) {
  //get best route based on light density (light count / distance)
  let bestRouteIndex = 0;
  let bestLightDensity = 0;
  for(var i=0; i<lightCounts.length; i++) {
    let distance = response.routes[i].legs[0].distance.value;
    let lightDensity = lightCounts[i]/distance;
    if(bestLightDensity < lightDensity) {
      bestRouteIndex = i;
      bestLightDensity = lightDensity;
    }
  }
  return bestRouteIndex;
}

new AutocompleteDirectionsHandler(map);
//first get coordinate data from AJAX call
getData();



};

/**
 * @constructor
*/
function AutocompleteDirectionsHandler(map) {
 this.map = map;
 this.originPlaceId = null;
 this.destinationPlaceId = null;
 this.travelMode = 'WALKING';
 var originInput = document.getElementById('origin-input');
 var destinationInput = document.getElementById('destination-input');
 var modeSelector = document.getElementById('mode-selector');
 this.directionsService = new google.maps.DirectionsService;
 this.directionsDisplay = new google.maps.DirectionsRenderer;
 this.directionsDisplay.setMap(map);

 var originAutocomplete = new google.maps.places.Autocomplete(
     originInput, {placeIdOnly: true});
 var destinationAutocomplete = new google.maps.places.Autocomplete(
     destinationInput, {placeIdOnly: true});

 this.setupClickListener('changemode-walking', 'WALKING');
 this.setupClickListener('changemode-transit', 'TRANSIT');
 this.setupClickListener('changemode-driving', 'DRIVING');

 this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
 this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

 this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
 this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
 this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
 var radioButton = document.getElementById(id);
 var me = this;
 radioButton.addEventListener('click', function() {
   me.travelMode = mode;
   me.route();
 });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
 var me = this;
 autocomplete.bindTo('bounds', this.map);
 autocomplete.addListener('place_changed', function() {
   var place = autocomplete.getPlace();
   if (!place.place_id) {
     window.alert("Please select an option from the dropdown list.");
     return;
   }
   if (mode === 'ORIG') {
     me.originPlaceId = place.place_id;
   } else {
     me.destinationPlaceId = place.place_id;
   }
   me.route();
 });

};

AutocompleteDirectionsHandler.prototype.route = function() {
 if (!this.originPlaceId || !this.destinationPlaceId) {
   return;
 }
 var me = this;

 this.directionsService.route({
   origin: {'placeId': this.originPlaceId},
   destination: {'placeId': this.destinationPlaceId},
   travelMode: this.travelMode
 }, function(response, status) {
   if (status === 'OK') {
     me.directionsDisplay.setDirections(response);
   } else {
     window.alert('Directions request failed due to ' + status);
   }
 });
};
