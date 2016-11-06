var polylines = [];
var selectedShape;
var selectedColor;

var densityGradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
];
var drawingManager;
var polyOptions = {
    strokeWeight: 0,
    fillOpacity: 0.45,
    editable: true
};
var routeHashMap = {};
var travelRoutes = [];
var directionsService;
var markers=[];
var map;
var heatmap;
var markerCluster;
var directionsService;
  
function clearSelection() {
  if (selectedShape) {
    selectedShape.setEditable(false);
    selectedShape = null;
    polylines = [];
  }
}

function setSelection(shape) {
  clearSelection();
  selectedShape = shape;
  shape.setEditable(true);
  selectColor(shape.get('fillColor') || shape.get('strokeColor'));
}

function deleteMarkers() {
    for(var i = 0; i< markers.length;i++){
      markers[i].setMap(null);
    }
    markers = [];
    markerCluster && markerCluster.clearMarkers();
    heatmap && heatmap.setMap(null);
    for(var i = 0; i < travelRoutes.length;i++){
      travelRoutes[i].setMap(null);
    }
}

function deleteSelectedShape() {
  if (selectedShape) {
    selectedShape.setMap(null);
  }
}

function selectColor(color) {
  selectedColor = color;
  var polylineOptions = drawingManager.get('polylineOptions');
  polylineOptions.strokeColor = color;
  drawingManager.set('polylineOptions', polylineOptions);

  var circleOptions = drawingManager.get('circleOptions');
  circleOptions.fillColor = color;
  drawingManager.set('circleOptions', circleOptions);

  var polygonOptions = drawingManager.get('polygonOptions');
  polygonOptions.fillColor = color;
  drawingManager.set('polygonOptions', polygonOptions);
}

function getDistanceBetweenPoints(p1, p2) {
    function rad (x) {
        return x * Math.PI / 180;
    };

    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.floor(d * 0.00062137); // returns the distance in miles
};

function performSearch(){
  deleteMarkers();
  
  function invokeService(points){
      var args = {
          tod:$("#day").val(),
          dateStart:dateStart,
          dateEnd:dateEnd
      };
      
      if(points !== undefined){
          args.polylines = points.substring(1);
      }
      
      $.post("/rides/find",args).done(function(response){
          var pointData = [];
          var results = response.data;
          var count = results.length;
          results.forEach(function(e){
            
            var pickup_latlng = new google.maps.LatLng(e.lat_pickup, e.lon_pickup);
            var dropoff_latlng = new google.maps.LatLng(e.lat_dropoff, e.lon_dropoff);
            
            routeHashMap[(pickup_latlng.lat()+","+pickup_latlng.lng())] = new google.maps.LatLng(e.lat_dropoff, e.lon_dropoff);
            var label = ("<b>Trip Distance: </b>" + getDistanceBetweenPoints(pickup_latlng,dropoff_latlng) + " Miles<br/><b>Dropoff Point</b> ("+dropoff_latlng.lat()+"," + dropoff_latlng.lng() +")");
            
            if(count === 1){
                heatmap = new google.maps.visualization.HeatmapLayer({
                    data: pointData,
                    map: map,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    gradient:densityGradient,
                    draggable:true
                });
                
                markers = pointData.map(function(location, i) {
                    var mark = new google.maps.Marker({
                      position: location,
                      clickable:true
                    });
                    mark.info = new google.maps.InfoWindow({
                      content: label
                    });
                  
                    google.maps.event.addListener(mark, 'click', function() {
                        mark.info.open(map, mark);
                        
                        function renderDirections(result, map) {
                            var directionsRenderer = new google.maps.DirectionsRenderer({
                                directions: result,
                                routeIndex: 0,
                                map: map,
                                polylineOptions: {
                                  strokeColor: "green"
                                }
                            });
                            travelRoutes.push(directionsRenderer);
                        }

                        function calculateAndDisplayRoute(origin, destination, directionsService, map) {
                            directionsService.route({
                                origin: origin,
                                destination: destination,
                                travelMode: google.maps.TravelMode.DRIVING,
                                provideRouteAlternatives: true
                            }, function(response, status) {
                                if (status === google.maps.DirectionsStatus.OK) {
                                  renderDirections(response, map);
                                } else {
                                  window.alert('Directions request failed due to ' + status);
                                }
                            });
                        }
                        
                        var pickupLoc = mark.getPosition();
                        var dropoffLoc = routeHashMap[pickupLoc.lat()+","+pickupLoc.lng()];
                        calculateAndDisplayRoute(pickupLoc,dropoffLoc, directionsService, map);
                    });
                    return mark;
                });
                
                markerCluster = new MarkerClusterer(map, markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            }
            count--;
            pointData.push(pickup_latlng);
          });
      });
  }

  var data="";
  var count = polylines.length;
  if(count === 0){
      invokeService(data);
      return;
  }

  //Format the polylines into PostgiGIS format
  polylines.forEach(function(e) {
    if(count === 1){
      data = data + "," + polylines[0].lng() + " " + polylines[0].lat();
      invokeService(data);
    }else{
      var lat = e.lat();
      var lon = e.lng();
      //console.log(e.lat() + " " + e.lng());
      data = data + "," + lon + " " + lat;
      count--;
    }
  });
}

function initMap()
{
  directionsService = new google.maps.DirectionsService();
  map = new google.maps.Map(document.getElementById('mapContainer'), {
      zoom: 10,
      center: {lat: 40.7383, lng: -74.0403 },
  });
  
  drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
            google.maps.drawing.OverlayType.POLYGON
        ]
      },
      circleOptions: polyOptions,
      polygonOptions: polyOptions,
      polylineOptions: {
          editable: true,
          draggable:true
      },
      markerOptions: {icon: 'assets/img/marker.png'},
      map: map
  });

  //add event listeners
  setTimeout(function(){
      google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
      google.maps.event.addListener(map, 'click', clearSelection);
      google.maps.event.addDomListener(document.getElementById('clear-shape'), 'click', deleteSelectedShape);
      google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
         polylines = event.overlay.getPath().getArray();
      });
      google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
          if (e.type != google.maps.drawing.OverlayType.MARKER) {
              // Switch back to non-drawing mode after drawing a shape.
              drawingManager.setDrawingMode(null);
    
              var newShape = e.overlay;
              newShape.type = e.type;
              google.maps.event.addListener(newShape, 'click', function() {
                  setSelection(newShape);
              });
              setSelection(newShape);
          }
      });
    
      performSearch();//load all data initially
  },1000);
}
