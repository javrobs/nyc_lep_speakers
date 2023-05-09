function allLanguages(){
  
  // Query API for all languages
  d3.json("http://127.0.0.1:5000/populations_all").then((data)=>{
    
    //Show data length in console. Should match total slices displayed
    // console.log(data.length);
    
    //Call on sunburst update function (false means data isnt filtered by language)
    updateSunburst(SunburstArrays(data,false));

  });
}


function sunburstFilter(language){

  // Query API for specific language
  d3.json(`http://127.0.0.1:5000/populations/${language}`).then((data)=>{

    //Show data length in console. Should match total slices displayed
    console.log(data.length);

    //Call on sunburst update function (true means data is filtered by language)
    updateSunburst(SunburstArrays(data,true));

  });
}

function SunburstArrays(data,filtered) {
  // Create lists for storing slices of sunburst

  // Referenced by parent array. Ids must be unique to each element (level 1, level 2, level 3)
  // e.g. "id_Manhattan" (for L1), "101" (for L2) or "101-Spanish" (for L3)
  let ids=[];

  // text that will be written in each slice field
  // e.g. "Manhattan" (for L1), "Battery Park City, Tribeca" (for L2) or "Spanish" (for L3)
  let labels=[];

  // array of parents of each element. 
  // e.g. "NYC LEP Speakers" (for L1, referencing L0), "id_Manhattan" (for L2, referencing L1) or "101" (for L3, referencing L2)
  let parents=[];

  // numerical value of element. parent elements must add up to child element's sum.
  // e.g. 227828 (for L1, Manhattan), 3136 (for L2, Battery Park City, Tribeca) or 304 (For L3, Spanish)
  let values=[];

  // Go row by row through data to populate lists, level by level:
  data.forEach(row =>  {

    //Level 1: Boroughs
    //If borough not in ids variable
    if (!ids.includes(`id_${row["Borough"]}`)){

      //To ID push ID_<boroughName>
      ids.push(`id_${row["Borough"]}`);

      //To label push borough name only
      labels.push(row["Borough"]);

      //If function argument for filtered is true, write down language filtered as a L0 Parent. Otherwise L0 parent is NYC
      if (filtered===true){
        parents.push(`${row["Language"]} LEP in NYC`);
      } else {
        parents.push("NYC LEP Speakers")
      }
      // Initialize value of borough by pushing a 0
      values.push(0);
    };

    //Level 2: Community districts
    //If community district not in ids variable
    if (!ids.includes(row["Borough Community District Code"])){

      //To ID push Community District Code number
      ids.push(row["Borough Community District Code"]);

      //To labels push Community District Name
      labels.push(row["Community District Name"]);

      //To parents push Community District id_<boroughName>
      parents.push(`id_${row["Borough"]}`);

      // Initialize value of Community District by pushing a 0
      values.push(0);
    }

    //Level 3: Languages
    //If no language is selected, append level 3 elements, otherwise skip the if part of code:
    if (filtered===false){
      //To ID push Community District Code number _<language>
      ids.push(`${row["Borough Community District Code"]}_${row["Language"]}`);

      //To labels push language e.g Italian
      labels.push(row["Language"]);

      //To parents push Community District Code number
      parents.push(row["Borough Community District Code"]);

      //To values push Population value of row
      values.push(row["LEP Population (Estimate)"]);
    }

    //Add up values for boroughs sum by searching index in IDS with id_<boroughName>, row by row
    values[ids.indexOf(`id_${row["Borough"]}`)]+=row["LEP Population (Estimate)"];

    //Add up values for community district sum by searching index in IDS with Community District Code, row by row.
    values[ids.indexOf(row["Borough Community District Code"])]+=row["LEP Population (Estimate)"];
  })
  return [ids,labels,parents,values];
}



function updateSunburst([ids,labels,parents,values]) {
  // console.log(labels)
  var trace = [
    {
      // Settings for sunburst content
      type: "sunburst",
      maxdepth: 3,
      hoverinfo:"label+text+value+percent parent+percent root",
      branchvalues: "total",
      ids: ids,
      labels: labels.map(line=>{return line.replace(", ", "<br>")}),
      parents: parents,
      marker:{line:{color:"white",width:0.2}},
      values:values,
      textposition: 'inside',
      insidetextorientation: 'radial',
      textfont:{size:12,color:"black"}
    }
  ];

  // 
  var layout = {
    // Settings for layout of sunburst
    margin: {l:30,r:30,t:30,b:30},
    paper_bgcolor: "rgba(255, 255, 255, 0)",
    autosize:true,
    // Colors obtained
    // sunburstcolorway:["#D67616","#62AA9F","#176F6A","#AD3A00","#7A2F1E"]
    //Corrected color palette for readability
    sunburstcolorway:["d67616","62aa9f","1c8782","c7531a","a63a24"]
  };

  Plotly.newPlot('content', trace, layout);
}