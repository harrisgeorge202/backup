Template.totalTickets.helpers({
    all: function () {
        return Tickets.find().count();
    },
    today: function () {
        var now = new Date();
        var dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);

        return Tickets.find({
            created: {
                $gte: dayAgo,
                $lt: now
            }
        }).count();
    },
    week: function () {
        var now = new Date();
        var weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        return Tickets.find({
            created: {
                $gte: weekAgo,
                $lt: now
            }
        }).count();

    },
    month: function () {
        var now = new Date();
        var monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);

        return Tickets.find({
            created: {
                $gte: monthAgo,
                $lt: now
            }
        }).count();
    },
    quarter: function () {
        var now = new Date();
        var quarterAgo = new Date();
        quarterAgo.setDate(quarterAgo.getDate() - 90);

        return Tickets.find({
            created: {
                $gte: quarterAgo,
                $lt: now
            }
        }).count();
    },
    year: function () {
        var now = new Date();
        var yearAgo = new Date();
        yearAgo.setDate(yearAgo.getDate() - 365);

        return Tickets.find({
            created: {
                $gte: yearAgo,
                $lt: now
            }
        }).count();
    },
    todayTrend: function () {
        var now = new Date();
        var start = new Date();
        start.setDate(start.getDate() - 1);
        var end = new Date();
        end.setDate(end.getDate() - 2);

        var today = Tickets.find({
            created: {
                $gte: start,
                $lt: now
            }
        }).count();
        var compareTo = Tickets.find({
            created: {
                $gte: end,
                $lt: start
            }
        }).count();
        if (compareTo > today) {
            return 'glyphicon-arrow-down glyph-green';
        } else if (compareTo < today) {
            return 'glyphicon-arrow-up glyph-red';
        } else {
            return 'glyphicon-minus';
        }
    },
    weekTrend: function () {
        var now = new Date();
        var start = new Date();
        start.setDate(start.getDate() - 7);
        var end = new Date();
        end.setDate(end.getDate() - 14);

        var week = Tickets.find({
            created: {
                $gte: start,
                $lt: now
            }
        }).count();

        var compareTo = Tickets.find({
            created: {
                $gte: end,
                $lt: start
            }
        }).count();

        if (compareTo > week) {
            return 'glyphicon-arrow-down glyph-green';
        } else if (compareTo < week) {
            return 'glyphicon-arrow-up glyph-red';
        } else {
            return 'glyphicon-minus';
        }
    },
    monthTrend: function () {
        var now = new Date();
        var start = new Date();
        start.setDate(start.getDate() - 30);
        var end = new Date();
        end.setDate(end.getDate() - 60);

        var month = Tickets.find({
            created: {
                $gte: start,
                $lt: now
            }
        }).count();

        var compareTo = Tickets.find({
            created: {
                $gte: end,
                $lt: start
            }
        }).count();
        if (compareTo > month) {
            return 'glyphicon-arrow-down glyph-green';
        } else if (compareTo < month) {
            return 'glyphicon-arrow-up glyph-red';
        } else {
            return 'glyphicon-minus';
        }
    },
    quarterTrend: function () {
        var now = new Date();
        var start = new Date();
        start.setDate(start.getDate() - 90);
        var end = new Date();
        end.setDate(end.getDate() - 180);

        var quarter = Tickets.find({
            created: {
                $gte: start,
                $lt: now
            }
        }).count();

        var compareTo = Tickets.find({
            created: {
                $gte: end,
                $lt: start
            }
        }).count();
        if (compareTo > quarter) {
            return 'glyphicon-arrow-down glyph-green';
        } else if (compareTo < quarter) {
            return 'glyphicon-arrow-up glyph-red';
        } else {
            return 'glyphicon-minus';
        }
    },
    yearTrend: function () {
        var now = new Date();
        var start = new Date();
        start.setDate(start.getDate() - 360);
        var end = new Date();
        end.setDate(end.getDate() - 720);

        var year = Tickets.find({
            created: {
                $gte: start,
                $lt: now
            }
        }).count();

        var compareTo = Tickets.find({
            created: {
                $gte: end,
                $lt: start
            }
        }).count();
        if (compareTo > year) {
            return 'glyphicon-arrow-down glyph-green';
        } else if (compareTo < year) {
            return 'glyphicon-arrow-up glyph-red';
        } else {
            return 'glyphicon-minus';
        }
    }
});
