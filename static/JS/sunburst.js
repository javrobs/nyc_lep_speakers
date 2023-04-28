d3.json("http://localhost:5000/populations").then((data)=>{
  console.log(data);
  console.log(data.length);
  
  //initial values function
  function init(){
  };
  init();
  // Create lists for storing slices of sunburst
  let ids=[];
  let labels=[];
  let parents=[];
  let values=[];



  data.forEach(row =>  {
    if (!ids.includes(`id_${row["Borough"]}`)){
      ids.push(`id_${row["Borough"]}`);
      labels.push(row["Borough"]);
      parents.push("");
    };
    if (!ids.includes(row["Borough Community District Code"])){
      ids.push(row["Borough Community District Code"]);
      labels.push(row["Community District Name"]);
      parents.push(`id_${row["Borough"]}`);
    }
    if (!ids.includes(`${row["Borough Community District Code"]}-${row["Language"]}`)){
      ids.push(`${row["Borough Community District Code"]}-${row["Language"]}`);
      labels.push(row["Language"]);
      parents.push(row["Borough Community District Code"]);
    }
  });
  console.log(ids,labels,parents);

var trace = [
    {
      type: "sunburst",
      ids: ids,
      labels: labels,
      parents: parents,
    }
  ];

var layout = {
  margin: {l: 0, r: 0, b: 0, t:0},
  sunburstcolorway:[
    "#636efa","#EF553B","#00cc96","#ab63fa","#19d3f3",
    "#e763fa", "#FECB52","#FFA15A","#FF6692","#B6E880"
  ],
  extendsunburstcolorway: true
};


Plotly.newPlot('sunburst', trace, layout);
 })