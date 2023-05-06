function demoBox(subjectLanguage) {
    let panel = d3.select('#sample-metadata');
    if (subjectLanguage==="All"){
        var URL="http://127.0.0.1:5000/demographic_all";
    }
    else {
        var URL=`http://127.0.0.1:5000/demographic/${subjectLanguage}`;
    }
    d3.json(URL).then((data) => {
            panel.html('');
            console.log(data);
            panel.append('h5').classed("demo_header",true).text(`Language:`);
            panel.append('h5').classed("demo_info",true).text(`${data["Language"]}`);
            panel.append('h5').classed("demo_header",true).text(`Limited English Proficiency (LEP) Speakers:`);
            panel.append('h5').classed("demo_info",true).text(`${data["Total LEP population"].toLocaleString("en-US")}`);
            if (Object.keys(data).includes("LEP Percentage")){
                panel.append('h5').classed("demo_header",true).text(`% of all LEP Speakers:`);
                panel.append('h5').classed("demo_info",true).text(`${data["LEP Percentage"]}`);
                // panel.append('h5').classed("demo_header",true).text(`Largest Communities:`);
                // let count=0;
                // data["Biggest Communities"].forEach((row)=>{
                //     count++;
                //     panel.append('h5').classed("demo_info",true).text(`${count}. ${row["Community District Name"]} (${row["Borough"]}): ${row["LEP Population (Estimate)"].toLocaleString("en-US")}`);
                // });
            }
            // else {
            //     panel.append('h5').classed("demo_header",true).text(`Largest Communities:`);
            //     let count=0;
            //     data["Biggest Communities"].forEach((row)=>{
            //         count++;
            //         panel.append('h5').classed("demo_info",true).text(`${count}. ${row["Community District Name"]} (${row["Borough"]}): ${row["LEP Population (Estimate)"].toLocaleString("en-US")}`);
            //         panel.append('h6').classed("demo_info",true).text(`(${row["Language"]})`);
            //     });
            // }
            
            
        });   
    console.log(`demographics updated`)
    // d3.select('#panel-body').append('div').attr('id','bar')
}
function horizontalBar(subjectLanguage) {
    if (subjectLanguage==="All"){
        var URL="http://127.0.0.1:5000/demographic_all";
    }
    else {
        var URL=`http://127.0.0.1:5000/demographic/${subjectLanguage}`;
    }
    d3.json(URL).then((data) => {
        console.log(`here's the data for the bar chart `);
        console.log(data);
        // grab data here
        let communities = data["Biggest Communities"].map(row => { 
            let rawName = row["Community District Name"];
            let cleanName = rawName.replace(", ", "<br>");
            return cleanName;
        });
        let total_population = data["Biggest Communities"].map(row => {return row["LEP Population (Estimate)"]});
        let boroughs = data["Biggest Communities"].map(row => {return row["Borough"]});
        // console.log(`here's the data for the y axis`);
        // console.log(communities);
        // console.log(`here's the data for the y axis`);
        // console.log(total_population);
        let barData =[
            {
                y: communities,
                x: total_population,
                hovertext: boroughs,
                type: "bar",
                marker:{color:"#7A2F1E"},
                // "#D67616","#62AA9F","#176F6A","#AD3A00","#7A2F1E"
                orientation: "h",
            },
        ];
         // 2. Create the layout for the bar chart.

        let barLayout = {
            title: "5 Biggest community districts",
            margin: { t: 30, l: 100 ,b:0,r:0},
            height: 200,
            paper_bgcolor: "rgba(255, 255, 255, 0)",
            plot_bgcolor:"rgba(255, 255, 255, 0)",

        };
        // 3. Use Plotly to plot the data with the layout.

        Plotly.newPlot("bar" , barData , barLayout);
    });

}