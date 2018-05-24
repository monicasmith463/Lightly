var coordinates = null;
var markers;

const distance = 0.01; // distance from route for box converage in km.

function initMap() {

  let promise = Promise.resolve($.get('/coordinate-data',
                                      function(data) {
                                        coordinates = data;
                                      })
                                )

  promise.then(function(response) {
    console.log("success!", window.coordinates[0]);
    //set up autocomplete

    //set up directions Service and directions display
    const directionsService = new google.maps.DirectionsService;
    const directionsDisplay = new google.maps.DirectionsRenderer;

    //create a new map object centered around Boise
    const windowMap = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      zoom: 10,
      center:  {lat: 43.61295367682718, lng: -116.19129651919633 }
    });
    //set the map on the directions display
    directionsDisplay.setMap(map);

    (function mapLights(coords) {
      console.log(coords[0]);
      markers = coords.map( coord => {
        new google.maps.Marker({
          position: { lat: coord[0], lng: coord[1] },
          map: map
        });
      })
      console.log("markers:", markers[0]);
    })(coordinates);

    // Sets the map on all markers in the array.
    (function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    })(windowMap);

    const autocompleteDirectionsHandler = new AutocompleteDirectionsHandler(map, directionsService, directionsDisplay);

    }, function(xhrObj, textStatus, err) {
    console.log("Request failed due to ", textStatus);
  })

  // function getData(){
  //   var promise = $.http({
  //     method: 'GET',
  //       url: '/coordinate-data',
  //       // data:supplierObj,
  //       withCredentials: false,
  //       // contentType:'application/json',
  //       dataType:'json'
  //     });
  //     console.log(promise);
  //     return promise; //Promise is returned
  // };
  // function getData() {
  //   $.get('/coordinate-data', function(data) {
  //       window.coordinates = data;
  //       console.log("coordinates: ", coordinates[0]);
  //   })
  // };


  //first get coordinate data from AJAX call
  // mapLights(coords=coordinates);


};

function getLightCounts(response, routeBoxer, coordinates) {
  //iterate over API response routes and box them
  //boxRoutes returns the list of routes from the response, each item is [routeObject, [boxObjects]]
  let boxedRoutes = boxRoutes(response, routeBoxer);
  return searchAreas(boxedRoutes, coordinates);
}

function boxRoutes(response, routeBoxer) {
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

  boxedRoute.forEach( boxedRoute => {
    let lightCount = 0;
    boxedRoute.forEach( box => {
      coordinates.forEach( coordinate => {
        //position is a lat lng object representing each light
        //check if each position is within range of route
        //if so, increase light count
        let position = new google.maps.LatLng(coordinate[0], coordinate[1]);
        if(box && box.getBounds().contains(position)) {
          console.log("in box");
          lightCount += 1;
        }
      })
    })
    lightCounts.push(lightCount);
  })
  //return the number of lights along each route
  return lightCounts;
};

function getBestRoute(response, lightCounts) {
  //get best route based on light density (light count / distance)
  let bestRouteIndex = 0;
  let bestLightDensity = 0;
  for(var i=0; i<response.routes.length; i++) {
    let distance = response.routes[i].legs[0].distance.value;
    let lightDensity = lightCounts[i]/distance;
    if(bestLightDensity < lightDensity) {
      bestRouteIndex = i;
      bestLightDensity = lightDensity;
    }
  }
  console.log("optimized!!!!");
  return bestRouteIndex;
}

 // @constructor

function AutocompleteDirectionsHandler(map, directionsService, directionsDisplay) {
  this.map = map;
  this.routeBoxer = new RouteBoxer();
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'WALKING';
  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  var modeSelector = document.getElementById('mode-selector');
  this.directionsService = directionsService;
  this.directionsDisplay = directionsDisplay;
  // this.directionsDisplay.setMap(map);

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
   travelMode: this.travelMode,
   provideRouteAlternatives: true
 },

 function (response, status) {
     if (status == google.maps.DirectionsStatus.OK) {
        //if only one route is returned default to route index 0
       let bestRouteIndex = 0;
       if(response.routes.length > 1) {
         let lightCounts = getLightCounts(response, me.routeBoxer, coordinates);
         bestRouteIndex = getBestRoute(response, lightCounts);
       }
       var route = new google.maps.DirectionsRenderer({
         map: me.map,
         directions: response,
         routeIndex: bestRouteIndex
       });
     } else {
       window.alert('Directions request failed due to ' + status);
     }
   })

};
