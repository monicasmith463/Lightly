//initially hide page content while we wait for page to load
$('#page-content').hide();

//loading screen while we wait for map to load
$(window).on('load', () => {
    // alert('page is loaded');
    $('#loading-content').hide();
    $('#page-content').show();
})

//initially hide
// $('#changepreference-shortest').hide();
// $('#changepreference-shortest').hide();

var coordinates;
var markers = [];

const distance = 0.01; // distance from route for box converage in km.

function initMap() {
  //declare a promise to ensure the rest of the script does not execute
  //before the asycronous AJAX call is is complete.
  //get data from coordinate-data endpoint:
  Promise.resolve($.get('/coordinate-data', data => { coordinates = data }))
         .then( response => {

    //set up directions Service and directions display
    const directionsService = new google.maps.DirectionsService;
    const directionsDisplay = new google.maps.DirectionsRenderer;

    //create a new map object centered around Boise
    const map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      zoom: 16,
      center:  {lat: 43.613401, lng: -116.200255 },
      styles: [
                {
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#242f3e"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#746855"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#242f3e"
                    }
                  ]
                },
                {
                  "featureType": "administrative.locality",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#d59563"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#d59563"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#263c3f"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#6b9a76"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#38414e"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry.stroke",
                  "stylers": [
                    {
                      "color": "#212a37"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9ca5b3"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#746855"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry.stroke",
                  "stylers": [
                    {
                      "color": "#1f2835"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#f3d19c"
                    }
                  ]
                },
                {
                  "featureType": "transit",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#2f3948"
                    }
                  ]
                },
                {
                  "featureType": "transit.station",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#d59563"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#17263c"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#515c6d"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#17263c"
                    }
                  ]
                }
              ]
    });

    //set light markers on map
    const mapLights = coords => {
      coords.forEach( coord => {
        let marker = new google.maps.Marker({
          position: { lat: coord[0], lng: coord[1] },
          icon: "../static/css/images/marker.png",
          map: map

        });
        marker.setMap(map);
        marker.setVisible(false);
        markers.push(marker);
      })
    };

    //map light positions
    mapLights(coordinates);

    //toggle all lights on
    const showLights = lights => {
      lights.forEach( light => {
        light.setVisible(true);
      })
    }

    //toggle all lights off
    const hideLights = lights => {
      lights.forEach( light => {
        light.setVisible(false);
      })
    }

    google.maps.event.addListener(map, 'zoom_changed', event => {
      //markers are very dense to look at so only display when the view is zoomed
      if(map.zoom >= 16) {
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
        strokeOpacity: 0,
        strokeColor: '#0000001',
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

const hideAll = () => {
  $("#unable-to-optimize-route-panel").hide();
  $("#all-optimized-route-panel").hide();
  $('#shortest-route-panel').hide();
  $("#longer-route-panel").hide();
}

const shortestRouteBestLighting = (distanceText, durationText) => {
  //trigger checkmark to stop loading and display
  hideAll();
  $('.distance-text').text(distanceText);
  $('.duration-text').text(durationText);
  $('#checkmark2').addClass('checked');
  $("#all-optimized-route-panel").show();
}

const longerRouteBestLighting = (densityDelta, durationDelta, distanceText, durationText) => {
  //trigger checkmark to stop loading and display
  hideAll();
  $('.distance-text').text(distanceText);
  $('.duration-text').text(durationText);
  $('#duration-delta').text(durationDelta);
  $('#percentage-text').text(densityDelta);
  $('#checkmark1').addClass('checked');
  $("#longer-route-panel").show();
}

const optimizationUnavailable = (distanceText, durationText) => {
  hideAll();
  $('.distance-text').text(distanceText);
  $('.duration-text').text(durationText);
  $('#unable-to-optimize-route-panel').show();
}

const shortestRoute = (distanceText, durationText) => {
  hideAll();
  $('.distance-text').text(distanceText);
  $('.duration-text').text(durationText);
  $('#shortest-route-panel').show();

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

  // this.setupClickListener('changepreference-lighting', 'LIGHTING');
  this.setupClickListener('changepreference-shortest', 'SHORTEST');

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(preferenceSelector);

}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, preference) {
 var button = document.getElementById(id);
 var me = this;
 button.addEventListener('click', function() {
   //enables radio button to change the optimization preferences
   me.preference = "SHORTEST";
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
       //if a route is already displayed, clear it
       if(me.currentRoute) {
         me.currentRoute.setMap(null);
       } else {
         $('#welcome-panel').hide();
       }

       let optimalIndex = 0;

        //if only one route is returned default to route index 0
       let distancesText = response.routes.map(route => route.legs[0].distance.text);
       let durationsText = response.routes.map(route => route.legs[0].duration.text);

       //else, perform route optimization based on light positions
      //if more than one route is possible, optimize:
        if(me.preference === "LIGHTING"){
           if(response.routes.length > 1) {
             //trigger checkmark to stop loading and display
             $('#checkmark1').removeClass('checked');
             $('#checkmark2').removeClass('checked');

             let lightCounts = getLightCounts(response, me.routeBoxer, me.map);
             // lightDensities is an indexed dictionary containing densities and length of routes
             let distances = response.routes.map(route => route.legs[0].distance.value);

             let densities = [];

             for(let i=0; i < lightCounts.length; i++) {
               densities.push(lightCounts[i]/distances[i]);
             }

             let optimalIndex = densities.indexOf(Math.max(...densities));

             if(optimalIndex === 0) {
               //if best lit is also the shortest, display panel for when route is both optimized and shortest
               shortestRouteBestLighting(distancesText[0], durationsText[0]);
             } else {
               //if best lit is not the shortest, calculate difference in duration between best-lit route and shortest route
               //durations of routes in seconds:
               let durations = response.routes.map(route => route.legs[0].duration.value);

               //calculate duration delta. convert seconds to minutes, round to nearest minute
               let durationDelta = Math.round((durations[optimalIndex] - durations[0])/60);

               //percentage difference in light density between bestLit and shortest, rounded to nearest 10%
               let densityDelta = 10 * Math.round(10 * ((densities[optimalIndex] - densities[0])/densities[0]));

               //if time difference is under one minute or percentage light density difference is <10%, insignificant, so show modal for all optimized
               if((durationDelta === 0) || (densityDelta === 0)) {
                 shortestRouteBestLighting(distancesText[0], durationsText[0]);
               } else {
                 //if time difference is > 1min and percent difference is <=10%, display modal with difference in duration and lighting coverage percentage.
                 //give user the option to choose the shorter route.
                 longerRouteBestLighting(densityDelta, durationDelta, distancesText[optimalIndex], durationsText[optimalIndex]);
               }
            }
          } else {
            optimizationUnavailable(distancesText[0], durationsText[0]);
          }
        } else {
          shortestRoute(distancesText[0], durationsText[0]);
        }

    //if preference is shortest, just default to index 0
       me.currentRoute = new google.maps.DirectionsRenderer({
         map: me.map,
         directions: response,
         routeIndex: optimalIndex || 0,
         polylineOptions: { strokeColor: '#3498db' }
       });
    me.preference = "LIGHTING";

     } else {
       window.alert('Directions request failed due to ' + status);
     }
   })

};
