var coordinates;
var markers = [];

const distance = 0.01; // distance from route for box converage in km.

function initMap() {
  //declare a promise to ensure the rest of the script does not execute
  //before the asycronous AJAX call is is complete.
  //get data from coordinate-data endpoint:
  let promise = Promise.resolve($.get('/coordinate-data',
                                      function(data) {
                                        coordinates = data;
                                      })
                               )
  //set up map
  promise.then( response => {
    //set up directions Service and directions display
    const directionsService = new google.maps.DirectionsService;
    const directionsDisplay = new google.maps.DirectionsRenderer;

    //create a new map object centered around Boise
    const map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      zoom: 13,
      center:  {lat: 43.61295367682718, lng: -116.19129651919633 }
    });

    //set light markers on map
    const mapLights = coords => {
      coords.forEach( coord => {
        let marker = new google.maps.Marker({
          position: { lat: coord[0], lng: coord[1] },
          map: map

        });
        marker.setMap(map);
        marker.setVisible(false);
        markers.push(marker);
      })
    };

    mapLights(coordinates);

    const showLights = lights => {
      lights.forEach( light => {
        light.setVisible(true);
      })
    }

    const hideLights = lights => {
      lights.forEach( light => {
        light.setVisible(false);
      })
    }

    google.maps.event.addListener(map, 'zoom_changed', function(event) {
      //markers are very dense to look at so only display when the view is zoomed
      console.log("zoom changed", map.zoom);
      if(map.zoom > 17) {
        console.log("zoom changed", map.zoom);
        showLights(markers);
      } else {
        hideLights(markers);
      }
    });

    const autocompleteDirectionsHandler = new AutocompleteDirectionsHandler(map, directionsService, directionsDisplay);

  }, (xhrObj, textStatus, err) => {
    console.log("Request failed due to ", textStatus);
  })
};

const getLightCounts = (response, routeBoxer, map) => {
  //iterate over API response routes and box them
  //boxRoutes returns the list of routes from the response, each item is [routeObject, [boxObjects]]
  let boxedRoutes = boxRoutes(response, routeBoxer, map);
  return searchAreas(boxedRoutes, coordinates);
}

const boxRoutes = (response, routeBoxer, map) => {
  //iterate over API response routes and box them
  let boxedRoutes = [];
  response.routes.forEach( route => {
    let path = route.overview_path;
    //routeBoxer returns an array of four tuples, the bounds of a rectangle
    let boxes = routeBoxer.box(path, distance);
    let boxpolys = [];
    boxes.forEach( box => {
      let newBox = new google.maps.Rectangle({
        bounds: box,
        fillOpacity: 0,
        strokeOpacity: 0.0,
        strokeColor: '#000001',
        strokeWeight: 1,
        map: map

      });
      boxpolys.push(newBox);
    });
    boxedRoutes.push(boxpolys);
  })
  return boxedRoutes;
}

const searchAreas = boxedRoutes => {
  //search over routes and return light count for each as an array
  let lightCounts = [];

  boxedRoutes.forEach( boxedRoute => {
    let lightCount = 0;
    boxedRoute.forEach( box => {
      markers.forEach( marker => {
        //position is a lat lng object representing each light
        //check if each position is within range of route
        //if so, increase light count
        let position = marker.position;
        if(box && box.getBounds().contains(position)) {
          lightCount += 1;
        }
      })
    })
    lightCounts.push(lightCount);
  })
  //return the number of lights along each route
  return lightCounts;
};

// const getDensitiesDistances = (response, lightCounts) => {
//   //get best route based on light density along route (light count / distance)
//   // let bestRouteIndex = 0;
//   // let bestLightDensity = 0;
//   let lightDensities = [];
//   let distances = [];
//   for(let i=0; i<response.routes.length; i++) {
//     let distance = response.routes[i].legs[0].distance.value;
//     let lightDensity = lightCounts[i]/distance;
//
//     lightDensities.push(lightDensity);
//     distances.push(distance);
//     //
//     // if(bestLightDensity < lightDensity) {
//     //   bestRouteIndex = i;
//     //   bestLightDensity = lightDensity;
//     // }
//   }
//   console.log("lightDensities", JSON.stringify(lightDensities));
//   return [lightDensities, distances];
// }


const getOptimalRouteIndex = (densities, distances) => {
  let mostLighted = densities.indexOf(Math.max(...densities));
  let shortest = distances.indexOf(Math.min(...distances));
  if(mostLighted === shortest) {
    return [shortest];
  }
  return [mostLighted, shortest];
}

// const getDensitiesDistances = (response, lightCounts) => {
//   //get best route based on light density along route (light count / distance)
//   // let bestRouteIndex = 0;
//   // let bestLightDensity = 0;
//   let lightDensities = [];
//   let distances = [];
//   for(let i=0; i<response.routes.length; i++) {
//     let distance = response.routes[i].legs[0].distance.value;
//     let lightDensity = lightCounts[i]/distance;
//
//     lightDensities.push(lightDensity);
//     distances.push(distance);
//     //
//     // if(bestLightDensity < lightDensity) {
//     //   bestRouteIndex = i;
//     //   bestLightDensity = lightDensity;
//     // }
//   }
//   console.log("lightDensities", JSON.stringify(lightDensities));
//   return [lightDensities, distances];
// }

// const getOptimalRouteIndex = (densities, distances) => {
  let mostLighted = densities.indexOf(Math.max(...densities));
  let shortest = distances.indexOf(Math.min(...distances));
//   if(mostLighted === shortest) {
//     return [shortest];
//   }
//   return [mostLighted, shortest];
// }

const optimizeByLightDensity = response => {
  let lightCounts = getLightCounts(response);

  //lightDensities is an indexed dictionary containing densities and length of routes
  let densitiesDistances = getDensitiesDistances(response, lightCounts);
  console.log("densities distance:", densitiesDistances);

  // optimizeRoute(...densitiesDistances);
  return

  let shortestRoute;
}

 // @constructor

function AutocompleteDirectionsHandler(map, directionsService, directionsDisplay) {
  this.map = map;
  this.routeBoxer = new RouteBoxer();
  this.currentRoute = null;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'WALKING';
  this.preference = 'LIGHTING';
  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  var preferenceSelector = document.getElementById('preference');
  this.directionsService = directionsService;
  this.directionsDisplay = directionsDisplay;
  this.directionsDisplay.setMap(map);

  var originAutocomplete = new google.maps.places.Autocomplete(
     originInput, {placeIdOnly: true});
  var destinationAutocomplete = new google.maps.places.Autocomplete(
     destinationInput, {placeIdOnly: true});

  this.setupClickListener('changepreference-lighting', 'LIGHTING');
  this.setupClickListener('changepreference-shortest', 'SHORTEST');
  // this.setupClickListener('changemode-driving', 'DRIVING');

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(preferenceSelector);
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, preference) {
 var radioButton = document.getElementById(id);
 var me = this;
 radioButton.addEventListener('click', function() {
   //enables radio button to change the optimization preferences
   me.preference = preference;
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
   //clear old routes from map
   // me.directionsDisplay.setMap(null);
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

       //if a route is already displayed, clear it
       if(me.currentRoute) {
         me.currentRoute.setMap(null);
       }

        //if only one route is returned default to route index 0
       let bestRouteIndex = 0;
       //else, perform route optimization based on light positions
      //if more than one route is possible, optimize:
      if(me.preference === "LIGHTING"){
        $('#modal-percentage').text('194358940325890438');
        $('#modal-lighting-optimized').modal('show');
        // $('#').prop();
         if(response.routes.length > 1) {
           // bestRouteIndex = optimizeByLightDensity(response, me.routeBoxer);
           // if(bestRouteIndex === 0)
           let lightCounts = getLightCounts(response, me.routeBoxer, me.map);
           // lightDensities is an indexed dictionary containing densities and length of routes
           let distances = response.routes.map(route => route.legs[0].distance.value);

           let durations = response.routes.map(route => route.legs[0].duration.value);

           let densities = [];

           for(let i=0; i < lightCounts.length; i++) {
             densities.push(lightCounts[i]/distances[i]);
           }

           let bestLit = densities.indexOf(Math.max(...densities));

           if(bestLit === 0) {
             //if best list is also the shortest, display modal for when route is both optimized and shortest

           }

           bestRouteIndex = getOptimalRouteIndex(...densitiesDistances)[0];
           console.log("index", bestRouteIndex);

           // let shortestRoute;
         // } else {
         // //   //if only one route and user preference is lighting, unable to optimize
         }
      }

    //if preference is shortest, just default to index 0
       me.currentRoute = new google.maps.DirectionsRenderer({
         map: me.map,
         directions: response,
         routeIndex: bestRouteIndex
       });

     } else {
       window.alert('Directions request failed due to ' + status);
     }
   })

};
