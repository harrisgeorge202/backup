Template.commentStats.helpers({
    averageCommentPerTicket: function () {
        var ticketCount = 0;
        var commentCount = 0;
        var data = Tickets.find({
            status: 'resolved'
        });

        data.forEach(function (ticket) {
            commentCount += ticket.commentCount;
            ticketCount++;
        });
        var returnData = Math.round(commentCount / ticketCount * 100) / 100 ? Math.round(commentCount / ticketCount * 100) / 100 : 0;
        return returnData;
    },
    rows: function () {
        Meteor.subscribe('commentsAll', Meteor.userId());
        var comments = Comments.find({
            userId: Meteor.userId()
        });

        // Populate array from cursor
        var arr = [];
        var index = 0;
        comments.forEach(function (cm) {
            arr[index] = cm.name;
            index += 1;
        });

        // Iterate through array to find duplicates, and store them in a new array with recurring count
        array_elements = arr;
        array_elements.sort();
        var finalArray = [];
        var current = null;
        var cnt = 0;
        for (var i = 0; i < array_elements.length; i++) {
            if (array_elements[i] != current) {
                if (cnt > 0) {
                    finalArray.push({
                        'Name': current,
                        'Count': cnt
                    });
                }
                current = array_elements[i];
                cnt = 1;
            } else {
                cnt++;
            }
        }
        if (cnt > 0) {
            finalArray.push({
                        'Name': current,
                        'Count': cnt
                    });
        }
        finalArray.sort(function (a, b) {
            if (a.Count > b.Count) return -1;
            if (a.Count < b.Count) return 1;
            return 0;
        });
        return finalArray;
    }
});