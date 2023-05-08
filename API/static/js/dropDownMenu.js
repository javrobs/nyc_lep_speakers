const URL = "http://127.0.0.1:5000/populations_all";

function setUp(){
    d3.json(URL).then((data)=>{
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
        optionChanged("All",true,false);
    });
}

function optionChanged(subjectLanguage,initialize,contentChanged) {
    demoBox(subjectLanguage);
    horizontalBar(subjectLanguage);
    content=d3.selectAll('input:checked').property("value");
    if (content=="map"){
        console.log("content is set to map");
        updateMap(subjectLanguage,initialize);
    }
    if (content=="sunburst"){
        if(contentChanged){
        myMap.remove()
        }
        if (subjectLanguage==="All"){
                allLanguages();
            }
            else {
                sunburstFilter(subjectLanguage);
            }
    }
    
}

function contentSelect(){
    console.log("contentSelect function was initialized")
    language=d3.select('select').property("value");
    d3.select('#content').html("").attr("class","panel");
    optionChanged(language,true,true)
}

setUp();
