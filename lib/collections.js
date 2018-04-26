/*jshint  undef: false */


Users = Meteor.users;

Packages = new Mongo.Collection('packages');
Platforms = new Mongo.Collection('platforms');
Questions = new Mongo.Collection('questions');
SavedCards = new Mongo.Collection('savedCards');
Sessions = new Mongo.Collection('sessions');
Packets = new Mongo.Collection('packets');

// Ticket Management Dashboard
Tickets = new Mongo.Collection('supporttickets');
Comments = new Mongo.Collection('comments');




Ticketemailcomments = new Mongo.Collection('ticketemailcomments');




// Sentiment analysis Dashboard
Syntaxanalyse = new Mongo.Collection('syntaxanalyses');
Syntaxanalysetotal = new Mongo.Collection('syntaxanalysetotals');
// Calculate a default name for a list in the form of 'List A'
Packages.uniquePlanName = function() {
    "use strict";
    var nextLetter = 'A', nextName = 'plan' + nextLetter;
    while (Packages.findOne({stripeId: nextName})) {
        // not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        nextName = 'plan' + nextLetter;
    }

    return nextName;
};
