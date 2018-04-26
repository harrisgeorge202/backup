var RATING_SYSTEM = 'ratingSystem', BASE_6 = 'base6', BASE_8 = 'base8', BASE_10 = 'base10';

Template.chart.onCreated(function() {
    console.log("Inside chart onCreated...");
});

Template.chart.onRendered(function () {
    console.log("Inside chart onRendered...");

    var barChart = null;
    var pieChart = null;
    var ctxBar = this.$('.barClass');
    var ctxPie = this.$('.pieClass');

    this.autorun(function() {
        console.log("Inside autorun chart...");

        if (Template.currentData().inputData) {
            console.log("Inside autorun chart update section...");
            console.log("Bar Chart Object: ", barChart);
            console.log("Pie Chart Object: ", pieChart);

            var chartData = Template.currentData().inputData;

            // Destory current chart before redrawing new one on the same template instance!
            // This section might not be needed in current solution!
            // if (barChart && pieChart) {
            //     console.log("Destroying old charts!!!");
            //     barChart.destroy();
            //     pieChart.destroy();
            // }

            console.log("Creating new charts!!!");

            // Chart setup variables for BASE_6, BASE_8, and BASE_10 ratingSystem
            var ratingSystem = Session.get(RATING_SYSTEM);
            if (ratingSystem == BASE_6) {
                var barChart_labels = ["0", "1", "2", "3", "4", "5"];
                var barChart_backgroundColor = [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(254, 157, 0, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ];
                var barChart_borderColor = [
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(254, 157, 0, 1)',
                    'rgba(75, 192, 192, 1)'
                ];
                var pieChart_labels = ["Promoters", "Passives   " /* need space here for styling! */, "Detractors"];
                var pieChart_backgroundColor = ["#90D3C1", "#FE9D00", "#FF6384"];
                var pieChart_hoverBackgroundColor = ["#90D3C1", "#FE9D00", "#FF6384"];
                var barChartData = Template.currentData().inputData.rating;
                var pieChartData = [chartData.promoters, chartData.passives, chartData.detractors];
            }
            else if (ratingSystem == BASE_8) {
                var barChart_labels = ["-4", "-3", "-2", "-1", "1", "2", "3", "4"];
                var barChart_backgroundColor = [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ];
                var barChart_borderColor = [
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)'
                ];
                var pieChart_labels = ["Positive", "Negative"];
                var pieChart_backgroundColor = ["#90D3C1", "#FF6384"];
                var pieChart_hoverBackgroundColor = ["#90D3C1", "#FF6384"];
                var barChartData = chartData.rating;
                var pieChartData = [chartData.positive, chartData.negative];
            }
            else if (ratingSystem == BASE_10) {
                var barChart_labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
                var barChart_backgroundColor = [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(254, 157, 0, 0.2)',
                    'rgba(254, 157, 0, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ];
                var barChart_borderColor = [
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(254, 157, 0, 1)',
                    'rgba(254, 157, 0, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)'
                ];
                var pieChart_labels = ["Promoters", "Passives   " /* need space here for styling! */, "Detractors"];
                var pieChart_backgroundColor = ["#90D3C1", "#FE9D00", "#FF6384"];
                var pieChart_hoverBackgroundColor = ["#90D3C1", "#FE9D00", "#FF6384"];
                var barChartData = Template.currentData().inputData.rating;
                var pieChartData = [chartData.promoters, chartData.passives, chartData.detractors];
            }

            // Bar Chart
            barChart = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: barChart_labels,
                    datasets: [{
                        label: 'Number of Ratings',
                        data: barChartData,
                        backgroundColor: barChart_backgroundColor,
                        borderColor: barChart_borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: true
                            }
                        }],
                        yAxes: [{
                             gridLines: {
                                display: true
                            },
                            ticks: {
                                beginAtZero: true,
                                //stepSize: 1
                            }
                        }]
                    }
                }
            });

            // Pie Chart
            pieChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: pieChart_labels,
                    datasets: [
                        {
                            data: pieChartData,
                            backgroundColor: pieChart_backgroundColor,
                            hoverBackgroundColor: pieChart_hoverBackgroundColor,
                            borderWidth: 1
                        }]
                },
                options: {}
            });

        }

    }.bind(this));

});

Template.chart.helpers({
    'questionText': function() {
        return Template.currentData().inputData.questionText;
    },
    'total': function() {
        return Template.currentData().inputData.total;
    },
    'average': function() {
        return Template.currentData().inputData.average;
    },
    'csvUrl': function() {
        return Template.currentData().csvUrl;
    }
});

Template.chart.events({
    // Nothin here!
});


// results variable format...
//
// results = [
//   {
//      'ratingSystem'  : ratingSystem,
//      'questionId'    : question._id,
//      'questionText'  : question.text,
//      'total'         : 0,
//      'average'       : 0,
//      'negative'      : 0,
//      'positive'      : 0,
//      'detractors'    : 0,
//      'passives'      : 0,
//      'promoters'     : 0,
//      'rating'        : [0, 0, 0, 0, 0, 0, 0, 0],
//      'responses'     : [{'name': name, 'email': email, 'ratedOn': date, 'rating': rating, 'comment', comment}, ...]]
//   },
//   ...
// ];
//
// negative and positive fields are available only in BASE_8 ratingSystem
// detractors, passives, and promoters fields are available only in BASE_6 and BASE_10 ratingSystem
// rating array is length 6, 8, or 10 based on ratingSystem type
