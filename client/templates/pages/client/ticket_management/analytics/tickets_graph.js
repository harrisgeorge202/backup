Template.ticketsGraph.onRendered(function () {
    this.autorun(function () {
        function chartData() {
            function getData(range) {
                var date = new Date();
                date.setDate(date.getDate() - range);
                cursor = Tickets.find({
                    status: 'resolved',
                    created: {
                        $lte: date
                    }
                });
                var count = 0;
                var AllTimeToResolve = 0;
                cursor.forEach(function (ticket) {
                    var timeToResolve = ticket.resolvedAt - ticket.created;
                    AllTimeToResolve += timeToResolve;
                    count += 1;
                });
                var result = Math.round(AllTimeToResolve / count / 60000);
                return isNaN(result) ? 0 : result;
            };
            return [getData(35), getData(28), getData(21), getData(14), getData(7), getData(0)];

        };

        var ctx = document.getElementById("ticketsGraph");
        var ticketsGraph = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Five Weeks Ago", "Four Weeks Ago", "Three Weeks Ago", "Two Weeks Ago", "Last Week", "This week"],
                datasets: [{
                    label: 'time to resolve ticket',
                    data: chartData(),
                    backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
                    borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
                    borderWidth: 1
        }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
            }]
                },
                legend: {
                    display: false
                }
            }
        });
    });

});

Template.ticketsGraph.helpers({
    averageResolveTime: function () {
        var count = 0;
        var AllTimeToResolve = 0;
        cursor = Tickets.find({
            status: 'resolved'
        });
        cursor.forEach(function (ticket) {
            var timeToResolve = ticket.resolvedAt - ticket.created;
            AllTimeToResolve += timeToResolve;
            count += 1;
        });
        var returnData = Math.round(AllTimeToResolve / count / 60000) ? Math.round(AllTimeToResolve / count / 60000) : 0;
        return returnData + ' minutes';
    }

});
