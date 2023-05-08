// Creating the map object
let myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 13
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "http://127.0.0.1:5000/communities/Spanish";

let geojson;

// To do:

// Get the data with d3.
d3.json(geoData).then(function(data) {

  console.log(data);
  
  // Create a new choropleth layer.
    geojson = L.choropleth(data, {

      // Define which property in the features to use.
      valueProperty: "population",

      // Set the color scale.
      scale: ["#ffffb2", "#b10026"],

      // The number of breaks in the step range
      steps: 10,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",

      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h1>${feature.properties.boro_cd}</h1> <hr> <h2>${feature.properties.population}</h2>`);
      }
    }).addTo(myMap);

    // Set up the legend.
  let legend = L.control({ position: "bottomright" });
    // Add minimum and maximum.
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = geojson.options.limits;
      let colors = geojson.options.colors;
      let labels = [];
  
      // Add the minimum and maximum.
      let legendInfo = "<h1>leyenda test<br />(leyenda test2)</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  // Adding the legend to the map
  legend.addTo(myMap);

});