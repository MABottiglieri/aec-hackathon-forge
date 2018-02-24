var myCharts = {
  doughnut:{
    options:{
      legend: { display: true, position:"bottom", labels:{boxWidth: 10} },
      layout: { padding: { left: 5, right: 5, top: 5, bottom: 5 } },
      responsive:true,
      animation:{animateRotate: true, animateScale: false},
      cutoutPercentage:50,
      maintainAspectRatio:false,
      scales: {
        //xAxes: [{ ticks: {min: 20, max: 75, beginAtZero: true}}],
        //yAxes: [{ ticks: {min: 0, max: 5, beginAtZero: true}}]
      },
      title: { display: true, text: 'ore per commessa' }
    },
    charts:[]
  },
  bar:{
    options:{
      legend: { display: false, position:"bottom", labels:{boxWidth: 10} },
      layout: { padding: { left: 5, right: 5, top: 5, bottom: 5 } },
      responsive:true,
      maintainAspectRatio:false,
      scales: {
        xAxes: [{ ticks: {min: 0, beginAtZero: true}}],
        yAxes: [{ ticks: {min: 0, beginAtZero: true}}]
      },
      title: { display: true, text: 'report' }
    },
    charts:[]
  }
};

$( document ).ready(function(){
  console.log('start viewer');
});
