// Store API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request 
d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define function, give each feature a popup
    function equakeData(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.mag)}</p>`);
    }

    // Create a GeoJSON layer, run the onEachFeature function
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: equakeData
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
        "Street Map": street
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

// Loop through the data and create marker for each earthquake
for (var i = 0; i < equakeData.length; i++) {

    // Conditionals for earthquakeData
    var color = "";
    if (equakeData[i].coordinates > 10) {
      color = "lawngreen";
    }
    else if (equakeData[i].coordinates > 30) {
      color = "greenyellow";
    }
    else if (equakeData[i].coordinates > 50) {
      color = "orange";
    }
    else if (equakeData[i].coordinates > 70) {
        color = "darkorange";
    }
    else if (equakeData[i].coordinates > 90) {
        color = "lightsalmon";
    }
    else {
      color = "indianred";
    }

  // Add circles to map
  L.circle(equakeData[i].coordinates, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: color,
    // Adjust the radius.
    radius: (equakeData[i].mag)
  });
}

// Add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        ranges = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // Loop through intervals, create label with a colored square
    for (var i = 0; i < ranges.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(ranges[i] + 1) + '"></i> ' +
            ranges[i] + (ranges[i + 1] ? '&ndash;' + ranges[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);