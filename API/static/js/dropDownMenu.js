const URL = "http://127.0.0.1:5000/populations_all";
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
        optionChanged("All",true);
    });
}

function optionChanged(subjectLanguage,initialize) {
    console.log(subjectLanguage);
    demoBox(subjectLanguage);
    horizontalBar(subjectLanguage);
    updateMap(subjectLanguage,initialize);
    if (subjectLanguage==="All"){
        allLanguages();
    }
    else {
        sunburstFilter(subjectLanguage);
    }
}

setUp();
