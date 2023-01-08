// Store API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request 
d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);

    // Use getColor to define ranges for legend
    function getColor(d) {
        return d > 10 ? 'lawngreen' :
            d > 30 ? 'greenyellow' :
                d > 50 ? 'orange' :
                    d > 70 ? 'darkorange' :
                        d > 90 ? 'lightsalmon' :
                            'white';
    };

function createFeatures(earthquakeData) {

    // Define function, give each feature a popup
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

                // Add circles to map
                L.circle(earthquakeData[i].properties, {
                    fillOpacity: 0.75,
                    color: "white",
                    fillColor: color,
                    // Adjust the radius.
                    radius: Math.exp(mag[i]) * 1000
                });

        // Create a GeoJSON layer, run the onEachFeature function
        var earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachFeature
        });

        // Send earthquakes layer to the createMap function
        createMap(earthquakes);

        // Loop through the data and create marker for each earthquake
        for (var i = 0; i < earthquakeData.length; i++) {

            // Conditionals for earthquakeData
            var color = "";
            if (earthquakeData[i].coordinates > 10) {
                color = "lawngreen";
            }
            else if (earthquakeData[i].coordinates > 30) {
                color = "greenyellow";
            }
            else if (earthquakeData[i].coordinates > 50) {
                color = "orange";
            }
            else if (earthquakeData[i].coordinates > 70) {
                color = "darkorange";
            }
            else if (earthquakeData[i].coordinates > 90) {
                color = "lightsalmon";
            }
            else {
                color = "indianred";
            }

        }
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

        // Create a layer control, add to map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

    }

    // Add legend

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            ranges = [-10, 10, 30, 50, 70, 90];

        // Loop through intervals, create label with a colored square
        for (var i = 0; i < ranges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(ranges[i] + 1) + '"></i> ' +
                ranges[i] + (ranges[i + 1] ? '&ndash;' + ranges[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

});