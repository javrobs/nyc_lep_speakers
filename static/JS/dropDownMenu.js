// const URL = "http://localhost:5000/populations";
const URL = "https://data.cityofnewyork.us/resource/ajin-gkbp.json";

function setUp(){
    d3.json(URL).then((data)=>{
        console.log("here is the JSON data!!!")
        console.log(data);
        // fetch languages for dropdown menu
        let languages = data.map(row =>  {
            // return row.Language;
            return row.language;
        });
        console.log(languages);
        languages.forEach(row => {
            d3.select('select').append('option').attr("value" , row).text(row);
        });
        optionChanged(languages[0]);
        });
    }

function optionChanged(subjectLanguage) {
    console.log(subjectLanguage);
    demoBox(subjectLanguage);
    // sunburstFilter(subjectLanguage);
}

function demoBox(subjectLanguage) {
    console.log(`demobox for ${subjectLanguage}`);
    let panel = d3.select('.panel-body');
    d3.json(URL).then((data) => {
        panel.html('');
        panel.append('h6').text(`we're doing a demobox for: ${subjectLanguage}`)
    // ${key.toUpperCase()}
    

    //     let panelInfo = data.map
    //     Object.entries(panelInfo)
    // })
});
}
setUp();
