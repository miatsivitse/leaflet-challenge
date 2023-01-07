// Store API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request 
d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData) {

    // Define function, give each feature a popup
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
    // Create a GeoJSON layer, run the onEachFeature function
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Send earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Create the base layers
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

  // Create a baseMaps object
  var baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

// Create map
var myMap = L.map("map", {
    center: [40.7608, -111.8910],
    zoom: 5,
    layers: [street]
});

  // Create a layer control and add to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}