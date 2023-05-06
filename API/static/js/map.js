// Creating the map object
var geojson;
var myMap
function updateMap(language,initialize) {
  if (initialize){
    console.log("Map connected")
    myMap = L.map("content", {
      center: [40.7128, -74.0059],
      zoom: 10
    });
    
    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    
  } else{
    myMap.removeLayer(geojson)
  }
  let geoData;
  if (language==="All"){
    geoData = "http://127.0.0.1:5000/communities_all";
  }
  else {
    geoData = `http://127.0.0.1:5000/communities/${language}`;
  };
  d3.json(geoData).then(function(data) {
  
    console.log(data);
    
    // Create a new choropleth layer.
      geojson = L.choropleth(data, {
  
        // Define which property in the features to use.
        valueProperty: "population",
  
        // Set the color scale.
        // scale: ["176f6a","517656","8d7c41","ab7f37","c9822c","e88521","d06111","b83d00","9e3810","833220"],
        scale:["feeed7","f8b550","f17604","cc3600"],
  
        // The number of breaks in the step range
        steps: 20,
  
        // q for quartile, e for equidistant, k for k-means
        mode: "e",
  
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },
  
        // Binding a popup to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup(`<h3 class="tight">${feature.properties.name}<br> (${feature.properties.borough})</h3> 
                            <br>
                            <h4 class="tight">LEP Population: ${feature.properties.population.toLocaleString("en-US")}</h4>`);
        }
      }).addTo(myMap);
  
      // Set up the legend.
    let legend = L.control({ position: "bottomright" });
      // Add minimum and maximum.
      legend.onAdd = function() {
        d3.select("div.info.legend").remove()
        let div = L.DomUtil.create("div", "info legend");
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];
    
        // Add the minimum and maximum.
        let legendInfo = "<h3>Population in<br> Community District</h3>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0].toLocaleString("en-US") + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1].toLocaleString("en-US") + "</div>" +
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
  }