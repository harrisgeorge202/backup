var RATING_SYSTEM = 'ratingSystem', BASE_6 = 'base6', BASE_8 = 'base8', BASE_10 = 'base10';

Template.overviewChart.onCreated(function () {
    console.log("Inside overviewChart onCreated...");

    this.ratingSystemBase8 = new ReactiveVar(false);
    this.average = new ReactiveVar(0);
    this.positive = new ReactiveVar(0);
    this.negative = new ReactiveVar(0);
    this.promoters = new ReactiveVar(0);
    this.passives = new ReactiveVar(0);
    this.detractors = new ReactiveVar(0);
});

Template.overviewChart.onRendered(function () {
    console.log("Inside overviewChart onRendered...");

    var lineChart = null;
    var ctxBar = this.$('.lineClass');

    this.autorun(function () {
        console.log("Inside autorun overviewChart...");

        if (Template.currentData().inputData) {
            console.log("Inside autorun overviewChart Update section...");

            var template = Template.instance();

            // Destory current charts before redrawing new one on the same template instance!
            // This section might not be needed in current solution!
            // var gauge_chart = this.$(".chart-gauge");
            // if (lineChart && typeof gauge_chart != 'undefined' && gauge_chart != null) {
            //     console.log("Destroying old overviewCharts!!!");
            //     lineChart.destroy();
            //     this.$(".chart-gauge").remove();
            // }

            console.log("Creating new overviewCharts!!!");

            var questionResults = Template.currentData().inputData;
            var numberOfQuestions = questionResults.length;
            console.log("Number of questionResults from inside overviewChart autorun: ", numberOfQuestions);

            // Chart setup variables for BASE_6, BASE_8 and BASE_10 ratingSystem
            var ratingSystem = Session.get(RATING_SYSTEM);
            var lineChart_labels;
            switch (ratingSystem) {
              case BASE_6:
                lineChart_labels = ["0", "1", "2", "3", "4", "5"];
                break;
              case BASE_8:
                lineChart_labels = ["-4", "-3", "-2", "-1", "1", "2", "3", "4"];
                break;
              default:
                lineChart_labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
            }

            // Only draw charts if we have results
            if (numberOfQuestions > 0) {
                // Insert new <div> into the DOM for gauge chart (not needed in current solution!)
                // this.$(".gauge-chart-container").append('<div id="chart-gauge" class="chart-gauge"></div>');

                // Convert -4 to +4 range to 0 to 8 range for gauge needle then to percent %!
                // or convert 0-5 range to percent if ratingSystem is BASE_6
                // or convert 1-10 range to percent if ratingSystem is BASE_10
                var gauge_value, gauge_sections;
                switch (ratingSystem) {
                  case BASE_6:
                    gauge_value = ((Number(template.average.get())) / 6).toFixed(2);
                    gauge_sections = 6
                    break;
                  case BASE_8:
                    gauge_value = ((Number(template.average.get()) + 4) / 8).toFixed(2);
                    gauge_sections = 8
                    break;
                  default:
                    gauge_value = ((Number(template.average.get())) / 10).toFixed(2);
                    gauge_sections = 10
                }

                // Draw gauge chart
                gauge(gauge_value, gauge_sections);

                // Draw line charts
                if (numberOfQuestions == 1) {
                    // Line Chart with 1 dataset
                    lineChart = new Chart(ctxBar, {
                        type: 'line',
                        data: {
                            labels: lineChart_labels,
                            datasets: [
                                {
                                    label: "Question 1",
                                    fill: true,
                                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                                    borderColor: "rgba(54, 162, 235, 1)",
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: questionResults[0].rating,
                                    spanGaps: false,
                                }
                            ]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        //stepSize: 1
                                    }
                                }]
                            }
                        }
                    });
                }
                else if (numberOfQuestions == 2) {
                    // Line Chart with 2 datasets
                    lineChart = new Chart(ctxBar, {
                        type: 'line',
                        data: {
                            labels: lineChart_labels,
                            datasets: [
                                {
                                    label: "Question 1",
                                    fill: true,
                                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                                    borderColor: "rgba(54, 162, 235, 1)",
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: questionResults[0].rating,
                                    spanGaps: false,
                                },
                                {
                                    label: "Question 2",
                                    fill: true,
                                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                                    borderColor: "rgba(75, 192, 192, 1)",
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: questionResults[1].rating,
                                    spanGaps: false,
                                }
                            ]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        //stepSize: 1
                                    }
                                }]
                            }
                        }
                    });
                }
                else if (numberOfQuestions == 3) {
                    // Line Chart with 3 datasets
                    lineChart = new Chart(ctxBar, {
                        type: 'line',
                        data: {
                            labels: lineChart_labels,
                            datasets: [
                                {
                                    label: "Question 1",
                                    fill: true,
                                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                                    borderColor: "rgba(54, 162, 235, 1)",
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: questionResults[0].rating,
                                    spanGaps: false,
                                },
                                {
                                    label: "Question 2",
                                    fill: true,
                                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                                    borderColor: "rgba(75, 192, 192, 1)",
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: questionResults[1].rating,
                                    spanGaps: false,
                                },
                                {
                                    label: "Question 3",
                                    fill: true,
                                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                                    borderColor: "rgba(153, 102, 255, 1)",
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: questionResults[2].rating,
                                    spanGaps: false,
                                }
                            ]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        //stepSize: 1
                                    }
                                }]
                            }
                        }
                    });
                }
            } // End of if (numberOfQuestions > 0)
        } // End of if (Template.currentData().inputData)
    }.bind(this)); // End of autorun
});

Template.overviewChart.helpers({
    'ratingSystemBase8': function() {
        return Session.get(RATING_SYSTEM) == BASE_8;
    },
    'total': function () {
        var questionResults = Template.currentData().inputData;
        var numberOfQuestions = questionResults.length;
        var total_feedback = 0;

        for (var i = 0; i < numberOfQuestions; i++) {
            total_feedback += Number(questionResults[i].total);
        }
        return total_feedback;
    },
    'average': function () {
        var self = Template.instance();
        var questionResults = Template.currentData().inputData;
        var numberOfQuestions = questionResults.length;
        var average_sum = 0;
        var total_sum = 0;
        for (var i = 0; i < numberOfQuestions; i++) {
            average_sum += Number(questionResults[i].average) * Number(questionResults[i].total);
            total_sum += Number(questionResults[i].total);
        }
        var average_result = (average_sum / total_sum);
        self.average.set(average_result.toFixed(2));

        console.log("Calling average helper from overviewChart, average = ", self.average.get());
        return self.average.get();
    },
    'positive': function () {
        var self = Template.instance();
        var questionResults = Template.currentData().inputData;
        var numberOfQuestions = questionResults.length;
        var positive_sum = 0;
        var negative_sum = 0;

        for (var i = 0; i < numberOfQuestions; i++) {
            positive_sum += Number(questionResults[i].positive);
            negative_sum += Number(questionResults[i].negative);
        }

        var total_feedback = positive_sum + negative_sum;
        var percentage = Math.round(positive_sum * 100 / total_feedback);

        self.positive.set(percentage.toString());
        console.log("Positive feedback rounded: ", percentage);

        console.log("Calling positive helper from overviewChart, positive = ", self.positive.get());
        return self.positive.get();
    },
    'negative': function () {
        var self = Template.instance();
        var questionResults = Template.currentData().inputData;
        var numberOfQuestions = questionResults.length;
        var positive_sum = 0;
        var negative_sum = 0;

        for (var i = 0; i < numberOfQuestions; i++) {
            positive_sum += Number(questionResults[i].positive);
            negative_sum += Number(questionResults[i].negative);
        }

        var total_feedback = positive_sum + negative_sum;
        var percentage = 100 - Math.round(positive_sum * 100 / total_feedback);

        self.negative.set(percentage.toString());
        console.log("Negative feedback rounded: ", percentage);

        console.log("Calling negative helper from overviewChart, negative = ", self.negative.get());
        return self.negative.get();
    },
    'promoters': function () {
        var self = Template.instance();
        var questionResults = Template.currentData().inputData;
        var numberOfQuestions = questionResults.length;
        var promoters_sum = 0;
        var passives_sum = 0;
        var detractors_sum = 0;

        for (var i = 0; i < numberOfQuestions; i++) {
            promoters_sum += Number(questionResults[i].promoters);
            passives_sum += Number(questionResults[i].passives);
            detractors_sum += Number(questionResults[i].detractors);
        }

        var total_feedback = promoters_sum + passives_sum + detractors_sum;
        var percentage = Math.round(promoters_sum * 100 / total_feedback);

        self.promoters.set(percentage.toString());
        console.log("Promoters feedback rounded: ", percentage);

        console.log("Calling promoters helper from overviewChart, promoters = ", self.promoters.get());
        return self.promoters.get();
    },
    'passives': function () {
        var self = Template.instance();
        var questionResults = Template.currentData().inputData;
        var numberOfQuestions = questionResults.length;
        var promoters_sum = 0;
        var passives_sum = 0;
        var detractors_sum = 0;

        for (var i = 0; i < numberOfQuestions; i++) {
            promoters_sum += Number(questionResults[i].promoters);
            passives_sum += Number(questionResults[i].passives);
            detractors_sum += Number(questionResults[i].detractors);
        }

        var total_feedback = promoters_sum + passives_sum + detractors_sum;
        var percentage = Math.round(passives_sum * 100 / total_feedback);

        self.passives.set(percentage.toString());
        console.log("Passives feedback rounded: ", percentage);

        console.log("Calling passives helper from overviewChart, passives = ", self.passives.get());
        return self.passives.get();
    },
    'detractors': function () {
        var self = Template.instance();
        var questionResults = Template.currentData().inputData;
        var numberOfQuestions = questionResults.length;
        var promoters_sum = 0;
        var passives_sum = 0;
        var detractors_sum = 0;

        for (var i = 0; i < numberOfQuestions; i++) {
            promoters_sum += Number(questionResults[i].promoters);
            passives_sum += Number(questionResults[i].passives);
            detractors_sum += Number(questionResults[i].detractors);
        }

        var total_feedback = promoters_sum + passives_sum + detractors_sum;
        var percentage = 100 - ( Math.round(passives_sum * 100 / total_feedback) + Math.round(promoters_sum * 100 / total_feedback) );

        self.detractors.set(percentage.toString());
        console.log("Detractors feedback rounded: ", percentage);

        console.log("Calling detractors helper from overviewChart, detractors = ", self.detractors.get());
        return self.detractors.get();
    }
});

Template.overviewChart.events({
    // Nothin here!
});

// Draw gauge chart function from 'http://codepen.io/jaketrent/pen/eloGk'
function gauge(value, sections) {
    var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;

    percent = value;
    barWidth = 30;
    numSections = sections;
    sectionPerc = 1 / numSections / 2;
    padRad = 0.05;
    chartInset = 10;
    totalPercent = .75;

    el = d3.select('.chart-gauge');

    margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    width = el[0][0].offsetWidth - margin.left - margin.right;
    height = width;
    radius = Math.min(width, height) / 2;

    percToDeg = function (perc) {
        return perc * 360;
    };

    percToRad = function (perc) {
        return degToRad(percToDeg(perc));
    };

    degToRad = function (deg) {
        return deg * Math.PI / 180;
    };

    svg = el.append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

    chart = svg.append('g').attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");

    for (sectionIndx = i = 1, ref = numSections; 1 <= ref ? i <= ref : i >= ref; sectionIndx = 1 <= ref ? ++i : --i) {
        arcStartRad = percToRad(totalPercent);
        arcEndRad = arcStartRad + percToRad(sectionPerc);
        totalPercent += sectionPerc;
        startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
        endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
        arc = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
        if (numSections == 10) {
            chart.append('path').attr('class', "arc chart10-color" + sectionIndx).attr('d', arc);
        } else if (numSections == 8) {
            chart.append('path').attr('class', "arc chart8-color" + sectionIndx).attr('d', arc);
        } else if (numSections == 6) {
            chart.append('path').attr('class', "arc chart6-color" + sectionIndx).attr('d', arc);
        }
    }

    Needle = (function () {
        function Needle(len, radius1) {
            this.len = len;
            this.radius = radius1;
        }

        Needle.prototype.drawOn = function (el, perc) {
            el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
            return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
        };

        Needle.prototype.animateOn = function (el, perc) {
            var self;
            self = this;
            return el.transition().delay(500).ease('elastic').duration(3000).selectAll('.needle').tween('progress', function () {
                return function (percentOfPercent) {
                    var progress;
                    progress = percentOfPercent * perc;
                    return d3.select(this).attr('d', self.mkCmd(progress));
                };
            });
        };

        Needle.prototype.mkCmd = function (perc) {
            var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
            thetaRad = percToRad(perc / 2);
            centerX = 0;
            centerY = 0;
            topX = centerX - this.len * Math.cos(thetaRad);
            topY = centerY - this.len * Math.sin(thetaRad);
            leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
            leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
            rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
            rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
            return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
        };

        return Needle;

    })();

    needle = new Needle(50, 10);
    needle.drawOn(chart, 0);
    needle.animateOn(chart, percent);
}


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
