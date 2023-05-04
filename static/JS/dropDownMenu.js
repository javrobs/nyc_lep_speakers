const URL = "http://localhost:5000/populations_all";
// const URL = "https://data.cityofnewyork.us/resource/ajin-gkbp.json";

function setUp(){
    d3.json(URL).then((data)=>{
        // console.log("here is the JSON data!!!")
        // console.log(data);
        // fetch languages for dropdown menu
        let languages=[]
        data.forEach(row =>  {
            if (!languages.includes(row.Language)){
            languages.push(row.Language);
            }
        });
        languages.sort()
        // console.log(languages);
        d3.select('select').append('option').attr("value", "All").text("All");
        languages.forEach(row => {
            d3.select('select').append('option').attr("value" , row).text(row);
        });
        optionChanged("All");
    });
}

function optionChanged(subjectLanguage) {
    console.log(subjectLanguage);
    demoBox(subjectLanguage);
    if (subjectLanguage==="All"){
        allLanguages();
    }
    else {
    sunburstFilter(subjectLanguage);
    }
}

function demoBox(subjectLanguage) {
    console.log(`demobox for ${subjectLanguage}`);
    let panel = d3.select('.panel-body');
    if (subjectLanguage==="All"){
        d3.json("http://localhost:5000/demographic_all").then((data) => {
            panel.html('');
            console.log(data);
            panel.append('h6').text(`we're doing a demobox for: ${subjectLanguage} ${Object.keys(data)[0]}`);
        });    
    }
    else {
        d3.json(`http://localhost:5000/demographic/${subjectLanguage}`).then((data) => {
            panel.html('');
            console.log(data);
            panel.append('h6').text(`we're doing a demobox for: ${subjectLanguage} ${Object.keys(data[0])[0]}`);
        });  
    }
    
}

setUp();
