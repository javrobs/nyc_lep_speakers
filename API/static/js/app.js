// JSON url
url="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON from URL and save it to a variable
d3.json(url).then(data => {
    console.log(data);
    // Add subjects by appending options to "select" html element 
    for (let i=0;i<data["names"].length;i++) {
        d3.select("select").append("option").text(data["names"][i]);
    }

    //run function called refresh to initialize charts and demographic info
    refresh();

    //run function called refresh every time there's a change in "select" html element
    d3.select("#selDataset").on("change",refresh)
    

    function refresh() {
        //Obtain subject from selected "option" in "select" element
        let subject=d3.select("#selDataset").property("value");

        //Update metadata
        //1. Remove all existing metadata
        d3.selectAll("div#sample-metadata>p").remove()
        //2. Use find function with id from subject to match an instance in dataset
        let metadata = data["metadata"].find(one=>{
            return one["id"]==subject;
        })
        //3. Save keys from metadata in array
        let keys=Object.keys(metadata);
        //4. For loop to append a paragraph for each key and value
        for (let i=0;i<keys.length;i++){
            d3.select("div#sample-metadata").append("p").text(`${keys[i]}: ${metadata[keys[i]]}`);
        }


        //Update bar chart
        //1. Use find function with id from subject to match an instance in dataset
        let samples = data["samples"].find(one=>{
            return one["id"]==subject;
        })
        console.log(samples)
        console.log(metadata)

        //2. Define trace and layout
        let trace1={
            y:samples["otu_ids"].map(value=>`OTU_${value} `).slice(0,9).reverse(),
            x:samples["sample_values"].slice(0,9).reverse(),
            text:samples["otu_labels"],
            type:"bar",
            marker:{color:"#d96149"},
            orientation:"h"
        };
        let layout1={margin:{t:0,r:0},height:500}
        //3. Create plot in "bar" div
        Plotly.newPlot("bar",[trace1],layout1);
        

        //Update bubble chart
        let trace2={
            x:samples["otu_ids"],
            y:samples["sample_values"],
            mode:"markers",
            text:samples["otu_labels"],
            marker:{
                color:samples["otu_ids"],
                colorscale:"earth",
                size:samples["sample_values"]
            }
        }
        let layout2={
            margin:{t:0},
            xaxis:{
                range:[Math.min(samples["otu_ids"])-300,Math.max(samples["otu_ids"])+300]
            },
            yaxis:{
                range:[Math.min(samples["sample_values"])-300,Math.max(samples["sample_values"])+300]
            },
            height:500
        }
        Plotly.newPlot("bubble",[trace2],layout2);
        

        //Update gauge
        let trace3={
            type:"indicator",
            mode: "gauge",
            value:metadata["wfreq"],
            title:"Belly Button Washing Frequency<br>Scrubs per week",
            gauge:{
                axis:{range:[0,10],tickwidth:1,tickcolor:"black"}
            }
        }
        let layout3={margin:{t:0},height:500}
        Plotly.newPlot("gauge",[trace3],layout3);
    }

});

