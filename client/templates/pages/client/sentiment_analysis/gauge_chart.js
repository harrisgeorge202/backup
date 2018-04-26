Template.gaugeChart.onRendered(function () {
  Session.setDefault('chartValue', 0);
  Session.setDefault('chartTotal', 43);

  Tracker.autorun(function () {
    updateChart();
  })
});

Template.gaugeChart.helpers({
  'total': function () {
    return Session.get('chartTotal');
  },

  'score': function () {
    return Math.round(((1 + Session.get('chartValue'))/2)*100);
  },

  'comment': function () {
    //do an average calculation
    var value = Math.round(((1 + Session.get('chartValue'))/2)*100);
    if (value < 20) {
      return "Very Negative";
    } else if (value >= 20 && value < 40) {
      return "Somewhat Negative";
    } else if (value >= 40 && value < 60) {
      return "Neutral";
    } else if (value >= 60 && value < 80) {
      return "Somewhat Positive";
    } else {
      return "Very Positive";
    };
  },
});

function updateChart() {
  $('#chart-gauge').remove();
  $('#gauge-chart-container').append('<div id="chart-gauge" class="chart-gauge" style="padding-left: 79px;"></div>')
  gauge(Session.get('chartValue'));
}

function gauge(value) {
  var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;
  percent = ((1 + value)/2)
  barWidth = 30;
  numSections = 10;
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
    chart.append('path').attr('class', "arc chart10-2-color" + sectionIndx).attr('d', arc);
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
};
