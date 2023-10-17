// Reference 15.1 Actvity 10
// Store our API endpoint as queryUrl. // Earthquake info from the past 7 Days Updated every minute. Significant Earthquakes (10/14/23 around 8:32am)
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<center><h3>${feature.properties.place}</h3><hr><p>Date and Time: ${new Date(feature.properties.time)}</p><p>Earthquake Depth: ${feature.geometry.coordinates[2]}</p></center>`);


      // Conditionals for circle color by their magnitute. Not sure where I am suppose to put this code, as of right now, it is not working...
      let color = "";
      if (feature.geometry.coordinates[2] > 10) {
        color = "#ABC4FF";
      }
      else if (feature.geometry.coordinates[2] > 30) {
        color = "#95A1D0";
      }
      else if (feature.geometry.coordinates[2] > 50) {
        color = "#7F7EA2";
      }
      else if (feature.geometry.coordinates[2] > 70) {
        color = "#695C73";
      }
      else if (feature.geometry.coordinates[2] > 90) {
        color = "#533945";
      }
      else {
        color = "#3D1616";
      }
  
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    style: function (feature) { // Leaflet documentation for geoJSON https://leafletjs.com/reference.html#geojson-style
      return {fillColor: 'blue', fillOpacity: 1, radius: (feature.properties.mag * 5), weight: 0.75, color: 'black'};
  },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng); // https://stackoverflow.com/questions/25364072/how-to-use-circle-markers-with-leaflet-tilelayer-geojson and STEVEN THOMAS (tutor) help!
  }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
};

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Legend specific. I got this code from the following link:  https://codepen.io/haakseth/pen/KQbjdO 
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML += '<i style="background: #ABC4FF"></i><span>-10 to 10</span><br>';
    div.innerHTML += '<i style="background: #95A1D0"></i><span>10 to 30</span><br>';
    div.innerHTML += '<i style="background: #7F7EA2"></i><span>30 to 50</span><br>';
    div.innerHTML += '<i style="background: #695C73"></i><span>50 to 70</span><br>';
    div.innerHTML += '<i style="background: #533945"></i><span>70 to 90</span><br>';
    div.innerHTML += '<i style="background: #3D1616"></i><span>90+</span><br>';
    
    return div;
  };

  legend.addTo(myMap);


}
