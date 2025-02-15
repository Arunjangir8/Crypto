if(document.getElementById("sparkline")){
var sparkline  = JSON.parse(document.getElementById("sparkline").getAttribute("value"));

var canvas = document.getElementById("priceChart");
var ctx = canvas.getContext("2d");
var gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, '#007bff');   
gradient.addColorStop(1, '#ffffff');

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#007bff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

function generateChart(yValues){
    var xValues = [];
        yValues.forEach((item, index) => {
        xValues.push(index);
    });
    new Chart(document.getElementById("priceChart"), {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          fill: true,
          backgroundColor: gradient, // Put the gradient here as a fill color
          borderColor: "#007bff",
          pointBackgroundColor: "#007bff",
          pointBorderColor: "#007bff",
          data: yValues
        }]
      },
      options: {
        elements: {
          point:{
              radius: 0
          }
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0,
            loop: true
          }
        },
        plugins: {
          customCanvasBackgroundColor: {
            color: '#ffffff',
          }
        },
        legend: {display: false},
        scales: {      y: { // defining min and max so hiding the dataset does not change scale range
          min: 0,
          max: 100
        }
        }
      },
      plugins: [plugin],
    });
    console.log(yValues[yValues.length-1])
}

generateChart(sparkline);
}

