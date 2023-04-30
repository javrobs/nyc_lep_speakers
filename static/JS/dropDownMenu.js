// const URL = "http://localhost:5000/populations";

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
        })
        });
    }
setUp();
