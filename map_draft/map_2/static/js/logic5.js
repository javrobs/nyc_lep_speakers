
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 13
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


function chooseColor(cd) {

    let found = find_Code(cd);

    if (found != -1) {
        return 'blue';
    } else {
        return 'gray';
    } // else

}

function makeStyle(feature) {
    let mapStyle = {
        color: 'gray',
        fillColor: chooseColor(feature.properties.boro_cd),
        fillOpacity: 0.5,
        weight: 1.5
    };
    return mapStyle;
}

// Find the code based on Neighborhood

function find_Code(boro_cd) {

    let found = false;

    for (let i = 0; i < spanish_data.length; i++) {

        if (spanish_data[i].District_Code == boro_cd) {
            found = true;
            return 1;
        }
    }
    if (found == false)
        return -1
}// find_Code()

function find_Speakers(p_code) {

    let found = false;

    for (let i = 0; i < spanish_data.length; i++) {

        if (spanish_data[i].District_Code == p_code) {
            found = true;
            return spanish_data[i].Population_Estimate;
        } // if
    } // for

    if (found == false)
        return -1

}// find_Speakers()


const link1 = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/nyc.geojson";
const link2="http://127.0.0.1:5000/communities_all"

d3.json(link1).then((nyc_polygons) => {
    console.log(nyc_polygons);
    // L.geoJson(nyc_polygons, {
    //     style: (feature) => makeStyle(feature),
    //     onEachFeature: (feature, layer) => {

    //         let found = find_Code(feature.properties.neighborhood);

    //         if (found === -1) { }

    //         else {

    //             console.log("found");
    //             console.log(find_Code(feature.properties.neighborhood));
    //             layer.bindPopup(`<h1>${feature.properties.neighborhood}</h1> <hr> <h2>${found}</h2>`);
    //             layer.on({
    //                 mouseover: (event) => {
    //                     layer = event.target;
    //                     layer.setStyle({
    //                         fillOpacity: .9,
    //                         weight: 2
    //                     });
    //                 },
    //                 mouseout: (event) => {
    //                     layer = event.target;
    //                     layer.setStyle({
    //                         fillOpacity: .5,
    //                         weight: 1.5
    //                     });
    //                 }
    //             })
    //         } // else
    //     }
    // }).addTo(myMap);
});

d3.json(link2).then((nyc_polygons) => {
    console.log(nyc_polygons);
    L.geoJson(nyc_polygons, {
        style: (feature) => makeStyle(feature),
        onEachFeature: (feature, layer) => {

            let found = find_Code(feature.properties.neighborhood);

            if (found === -1) { }

            else {

                console.log("found");
                console.log(find_Code(feature.properties.neighborhood));
                layer.bindPopup(`<h1>${feature.properties.neighborhood}</h1> <hr> <h2>${found}</h2>`);
                layer.on({
                    mouseover: (event) => {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: .9,
                            weight: 2
                        });
                    },
                    mouseout: (event) => {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: .5,
                            weight: 1.5
                        });
                    }
                })
            } // else
        }
    }).addTo(myMap);

});