Template.barChart.onRendered(function () {
  var chart = drawChart(buildDataset());
  Tracker.autorun(function () {
    updateChart(chart);
  });
});

function updateChart(chart) {
  var data = buildDataset(); //import the new data from watson
  chart.data.datasets[0].data = data; //replace old data with new data

  chart.update(); //update the chart
}

function buildDataset() {
  var dataset = [0, 0, 0, 0, 0];
  if(Session.get('watsonAnalysis')) {
    var watson = Session.get('watsonAnalysis');
    var emotions = watson.emotion.document.emotion;
    dataset = [emotions.joy, emotions.anger, emotions.disgust, emotions.sadness, emotions.fear];
    for (i = 0; i < dataset.length; i++) {
      dataset[i] = Math.round(dataset[i] * 100);
    }
  }

  return dataset;
};

function drawChart(data) {
  var ctx = document.getElementById("myChart");
  ctx.height = 150;
  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: ["Happiness", "Anger", "Disappointment", "Unhappiness", "Anxiety"],
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)', //yellow
          'rgba(255, 99, 132, 0.2)', //red
          'rgba(139, 195, 74, 0.2)', //green
          'rgba(54, 162, 235, 0.2)', //blue
          'rgba(153, 102, 255, 0.2)', //purple
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(255,99,132,1)',
          'rgba(139, 195, 74, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      animation: {
        duration: 2500,
        easing: 'easeOutElastic',
        onComplete: function () {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.font = "Helvetica Neue"
          ctx.fillStyle = "black";
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index];
              ctx.fillText(data + "%", chartInstance.width - 25, bar._model.y + 8);
            });
          });
        }
      },

      responsive: true,
      maintainAspectRatio: false,
      hover: { mode: false, animationDuration: 0, },
      legend: { display: false, },
      tooltips: { enabled: false, },
      scales: {
        xAxes: [{
          display: false,
          gridLines: { display: false, },
          ticks: { beginAtZero: true, min: 0, max: 100, },
        }],

        yAxes: [{
          barPercentage: 0.8,
          categoryPercentage: 0.8,
          fontSize: 8,
          gridLines: { display: false, },
          ticks: { beginAtZero: true, },
        }],
      },
    }
  });
  return myChart;
}
