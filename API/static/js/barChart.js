function horizontalBar(subjectLanguage) {
    // getting information from the different APIS depending on the option chosen in dropdown menu
    if (subjectLanguage==="All"){
        var URL="http://127.0.0.1:5000/demographic_all";
    }
    else {
        var URL=`http://127.0.0.1:5000/demographic/${subjectLanguage}`;
    }
    d3.json(URL).then((data) => {
        // console.log(data);
        // grab data here
        let communities = data["Biggest Communities"].map(row => { 
            let rawName = row["Community District Name"];
            // addred <br> to make the information fit better
            let cleanName = rawName.replace(", ", "<br>");
            return cleanName;
        });
        let total_population = data["Biggest Communities"].map(row => {return row["LEP Population (Estimate)"]});
        let boroughs = data["Biggest Communities"].map(row => {return row["Borough"]});
        if (subjectLanguage==="All"){
            // added hover information to barchart
            var height=300;
            languages = data["Biggest Communities"].map(row => {return row["Language"]})
            var hover=[]
            for(let i=0;i<languages.length;i++){
                hover.push(`${boroughs[i]}<br>${languages[i]}`);
            };
            // console.log(hover)
        }
        else {
            var height=250;
            var hover = boroughs;
        }
        // console.log(`here's the data for the y axis`);
        // console.log(communities);
        // console.log(`here's the data for the y axis`);
        // console.log(total_population);
        let barData =[
            {
                y: communities.reverse(),
                x: total_population.reverse(),
                hovertext: hover.reverse(),
                type: "bar",
                marker:{color:"#176F6A"},
                // "#D67616","#62AA9F","#176F6A","#AD3A00","#7A2F1E"
                orientation: "h",
            },
        ];
         // 2. Create the layout for the bar chart.

        let barLayout = {
            title: "Largest Community Districts",
            margin: { t: 50, l: 150 ,b:20,r:10},
            height: height,
            width: 450,
            paper_bgcolor: "rgba(255, 255, 255, 0)",
            plot_bgcolor:"rgba(255, 255, 255, 0)",

        };
        // 3. Use Plotly to plot the data with the layout.

        Plotly.newPlot("bar" , barData , barLayout);
    });

}