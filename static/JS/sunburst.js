d3.json("http://localhost:5000/populations").then((data)=>{
  console.log(data);
});

// var data = [
//     {
//       type: "sunburst",
//       maxdepth: 3,
//       ids: unpack(rows, 'ids'),
//       labels: unpack(rows, 'labels'),
//       parents:unpack(rows, 'parents')
//     }
//   ];

// var layout = {
//   margin: {l: 0, r: 0, b: 0, t:0},
//   sunburstcolorway:[
//     "#636efa","#EF553B","#00cc96","#ab63fa","#19d3f3",
//     "#e763fa", "#FECB52","#FFA15A","#FF6692","#B6E880"
//   ],
//   extendsunburstcolorway: true
// };


// Plotly.newPlot('myDiv', data, layout, {showSendToCloud: true});
// })