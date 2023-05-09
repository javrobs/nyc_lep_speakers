function demoBox(subjectLanguage) {
    // called corresponding api depending on what the user chooses in the dropdown menu
    let panel = d3.select('#sample-metadata');
    if (subjectLanguage==="All"){
        var URL="http://127.0.0.1:5000/demographic_all";
    }
    else {
        var URL=`http://127.0.0.1:5000/demographic/${subjectLanguage}`;
    }
    // called data
    d3.json(URL).then((data) => {
            // reset the demobox to EMPTY
            panel.html('');
            // console.log(data);

            // ADD ALL DATA TO DEMOBOX
            panel.append('h5').classed("demo_header",true).text(`Language:`);
            panel.append('h5').classed("demo_info",true).text(`${data["Language"]}`);
            panel.append('h5').classed("demo_header",true).text(`Limited English Proficiency (LEP) Speakers:`);
            panel.append('h5').classed("demo_info",true).text(`${data["Total LEP population"].toLocaleString("en-US")}`);
            // IF WE'RE DISPLAYING INFO OF SPECIFIC LANGUAGE, DISPLAY THE PERCENTAGE THAT SPECIFIC LANGUAGE TAKES FROM THE WHOLE LEP SPEAKERS
            if (Object.keys(data).includes("LEP Percentage")){
                panel.append('h5').classed("demo_header",true).text(`% of all LEP Speakers:`);
                panel.append('h5').classed("demo_info",true).text(`${data["LEP Percentage"]}`);
                
            }           
            
        });   
    // console.log(`demographics updated`)
    // d3.select('#panel-body').append('div').attr('id','bar')
}
