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
            // console.log(data);
            panel.append('h5').classed("demo_header",true).text(`Language:`);
            panel.append('h5').classed("demo_info",true).text(`${data["Language"]}`);
            panel.append('h5').classed("demo_header",true).text(`Limited English Proficiency (LEP) Speakers:`);
            panel.append('h5').classed("demo_info",true).text(`${data["Total LEP population"].toLocaleString("en-US")}`);
            if (Object.keys(data).includes("LEP Percentage")){
                panel.append('h5').classed("demo_header",true).text(`% of all LEP Speakers:`);
                panel.append('h5').classed("demo_info",true).text(`${data["LEP Percentage"]}`);
                
            }           
            
        });   
    // console.log(`demographics updated`)
    // d3.select('#panel-body').append('div').attr('id','bar')
}
