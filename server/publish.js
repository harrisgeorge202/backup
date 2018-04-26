/**
 * Created by baboon-soft on 15/12/15.
 */
/*global Meteor, Packages, Roles, Platforms, console, Questions, Sessions, SavedCards */

Meteor.publish('packages', function () { //listId
    "use strict";
    //check(listId, String);
    return Packages.find({status: {$nin: ["deleted", false]},public: true}, {sort: {"price": 1}});
});

Meteor.publish('packagesAll', function () {
    "use strict";
    var user = Meteor.users.findOne({
        _id: this.userId
    });
    if (Roles.userIsInRole(user, ["admin"])) {
        return Packages.find({status: {$ne: "deleted"}},{sort : { "price":1}});
    } else {
        return [];
    }
});

Meteor.publish('platforms', function () {
    "use strict";
    return Platforms.find({status: {$ne: "deleted"}});
});


Meteor.publish('authKeys', function (platformId) {
    "use strict";
    if (!platformId) {
        return;
    }
    return Sessions.find({ownerId: this.userId, platformId: platformId});
});

Meteor.publish('questions', function (platformId, userIdOptional) { //, limit
    "use strict";
    if (!platformId || !this.userId) {
        return [];
    }

    var userId = this.userId,
        dl = 3; //limit || 3;

    if (userIdOptional) {
        var user = Meteor.users.findOne({
            _id: this.userId
        });
        if (Roles.userIsInRole(user, ["admin"])) {
            userId = userIdOptional;
        }
    }

    return Questions.find({
        status: {
            $ne: "deleted"
        },
        platformId: platformId,
        userId: userId
    }, {
        limit: dl
    });
});

Meteor.publish('averageRating', function (platformId, userIdOptional, noOfDays) { //, limit
    "use strict";
    if (!platformId || !this.userId) {
        return [];
    }

    var userId = this.userId,
        dl = 3; //limit || 3;

    if (userIdOptional) {
        var user = Meteor.users.findOne({
            _id: this.userId
        });
        if (Roles.userIsInRole(user, ["admin"])) {
            userId = userIdOptional;
        }
    }

    var questions = Questions.find({
        status: {
            $ne: "deleted"
        },
        platformId: platformId,
        userId: userId
    }, {
        limit: dl
    });

    var b, questionIdArray = [],
        averageQuestions = {};

    for (b = 0; b < questions.length; b++) {
        questionIdArray.push(questions[b]._id);
    }

    questionIdArray = ["MRDjR962Aka8gDNxa"];

    var ratings = Packets.find({
        status: "rated",
        questionId: {
            "$in": questionIdArray
        }
    }).fetch();

    ratings.push(ratings[0]);

    if (ratings.length) {
        for (b = 0; b < ratings.length; b++) {
            if (!averageQuestions[ratings[b].questionId]) {
                averageQuestions[ratings[b].questionId] = {};
            }
            averageQuestions[ratings[b].questionId] = {
                rating: (averageQuestions[ratings[b].questionId].rating) ? averageQuestions[ratings[b].questionId].rating + ratings[b].rating : ratings[b].rating,
                number: (averageQuestions[ratings[b].questionId].number) ? averageQuestions[ratings[b].questionId].number + 1 : 1
            };
        }
    }
    return [];
});

Meteor.publish("userList", function () {
    "use strict";

    var user = Meteor.users.findOne({
        _id: this.userId
    });


    /*
       var session=Meteor.sessions.findOne({
            ownerId:this.userId
        });
    */



    if (Roles.userIsInRole(user, ["admin"])) {
        return Meteor.users.find({
            roles: 'user'
        }, {
            fields: {
                packageChosen: 1,
                packageId: 1,
                emails: 1,
                roles: 1,
                profile: 1,
                status: 1,
                monthlyEmailLimit: 1,
                packageEmailLimit: 1,
                settings: 1,
                ticketDashboard: 1,
                sentimentAnalysisDashboard : 1
            }
        });
    }

    return [];
});

Meteor.publish('savedCards', function () {
    "use strict";
    if (!this.userId) {
        return [];
    }
    return SavedCards.find({
        userId: this.userId
    });
});

Meteor.publish('feedback', function (userId) {
    "use strict";
    if (!this.userId) {
        return [];
    }

    var user = Meteor.users.findOne({
        _id: this.userId
    });

    if (Roles.userIsInRole(user, ["admin"])) {
        return Sessions.find({
            ownerId: userId,
            status: {
                $ne: "deleted"
            }
        });
    } else {
        return Sessions.find({
            ownerId: this.userId,
            status: {
                $ne: "deleted"
            }
        });
    }

});
Meteor.publish('syntaxanalyse', function (platformId) {
    "use strict";
    if (!platformId) {
        return [];
    }
    return Syntaxanalyse.find({
        platformId: platformId
    });
});
Meteor.publish('syntaxanalysetotal', function (platformId) {
    "use strict";
    if (!platformId) {
        return [];
    }
    return Syntaxanalysetotal.find({
        platformId: platformId
    });

});



Meteor.publish('userDetails', function () {
    if (!this.userId) {
        return []
    } else {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                settings: 1,
                ticketDashboard : 1,
                sentimentAnalysisDashboard : 1
            }
        })
    }
})

/*Meteor.publish('sessions', function () {
    "use strict";
    return Sessions.find();
});*/

Meteor.publish('settingsSessions', function () {
    return Sessions.find()
})

Meteor.publish('sessions', function (userId) {
    if (!userId) {
        return []
    } else {
        return Sessions.find({
            ownerId: userId
        })
    }
});

// Ticket Management Dashboard
Meteor.publish('ticketDashboardField', function () {
    if(!this.userId) {
        return [];
    } else {
        return Meteor.users.find({
            _id: this.userId
        },  {
            fields: {
                'ticketDashboard': 1,
                'sentimentAnalysisDashboard': 1
            }
        });
    }
});

Meteor.publish('tickets', function (id) {
    "use strict";
    return Tickets.find({
        userId: id
    });
});

Meteor.publish('ticketsUnresolved', function () {
    return Tickets.find({
        status: 'unresolved'
    });
});

Meteor.publish('ticketsResolved', function () {
    return Tickets.find({
        status: 'resolved'
    });
});

Meteor.publish('ticketView', function (id) {
    var ticket = Tickets.findOne({_id: id});
    return [
        Tickets.find({
            _id: id
        }),
        Packets.find({
            _id : new Mongo.ObjectID(ticket.packetId)
        })
    ];
});

Meteor.publish('comments', function (ticketId) {
    return Comments.find({
        ticketId: ticketId
    });
});




Meteor.publish('ticketemailcomments', function (ticketId) {
    return Ticketemailcomments.find({
        ticketId: ticketId
    });
});




Meteor.publish('commentsAll', function (id) {
    return Comments.find({
        userId: id
    });
});