<!-- Filename: public/index.html -->
<html ng-app="OSM">
<head>
  <title>Headlines Near Me</title>
  <!-- Angular Material CSS now available via Google CDN; version 0.8 used here -->
  <style>
    @import 'https://ajax.googleapis.com/ajax/libs/angular_material/0.9.0/angular-material.min.css';
    @import 'https://api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.css';
    @import 'https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css';
    @import 'https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css';
    body md-toolbar {
      background-color: #3f51b5;
      color: rgba(255, 255, 255, 0.87);
    }

  </style>
</head>
<body layout="column" ng-controller="MainCtrl">
<md-toolbar class="md-whiteframe-z3">
  <div class="md-toolbar-tools">
    <span flex>Headlines Near Me</span>
  </div>
</md-toolbar>
<div id="map" class="md-whiteframe-z2" flex></div>

<!--Plugins-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" type="text/javascript"></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.js'></script>
<script src="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js"></script>

<script>
  $(document).ready(function () {
    // Loading map from mapbox
    // Setting view to london
    L.mapbox.accessToken = 'pk.eyJ1IjoiaW5zMWQzciIsImEiOiJmYTk5MjY4ZWMwNjVmNWVlZDdiZmQzOGE4ZWE2M2QxZCJ9.3aNjVwLZwEvRoZefs-vFvw';
    var map = L.mapbox.map('map', 'ins1d3r.a901164f')
        .setView(current_location, 5);

    // Create the marker group again
    var markerGroup = new L.MarkerClusterGroup().addTo(map);

    $.ajax({
      url       : 'https://api-us.clusterpoint.com/100842/NYTHeadlines/_search?v=32',
      type      : 'POST',
      dataType  : 'json',
      data      : '{"query": "<title>~=\\"\\"</title>' +
      '","list": "<lat>yes</lat>' +
      '<lng>yes</lng>' +
      '<url>yes</url>' +
      '<title>yes</title>",' +
      '"docs": "1000"}',
      beforeSend: function (xhr) {
        // Authentication
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('test@dothewww.com:test'));
      },
      success: function (data) {
        if (data.documents) {
          // Draw each marker
          for (var i = 0; i < data.documents.length; i++) {
            var marker = data.documents[i];
            if (marker.lat && marker.lng) {
              drawMarker(marker);
            }
          }

          // Move view to fit markers
          if (markerGroup.getLayers().length) {
            map.fitBounds(markerGroup.getBounds());
          }
        }
      },
      fail: function (data) {
        alert(data.error);
      }
    });

    function drawMarker(story) {
      // Set marker, set custom marker colour
      var marker = L.marker([story.lat, story.lng], {
        icon: L.mapbox.marker.icon({
          'marker-color': 'ff8888'
        })
      });

      var published = new Date(story.published);
      marker.bindPopup('<a href="'+story.url+'" target="_blank">'+story.title+'</a><br />'+story.location+'<br />'+published);

      // Add to marker group layer
      markerGroup.addLayer(marker);
    }
  });
</script>
</body>
</html>