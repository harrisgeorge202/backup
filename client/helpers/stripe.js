Meteor.startup(function() {
    var stripeKey = Meteor.settings.public.stripe.livePublishableKey;
    Stripe.setPublishableKey( stripeKey );
    //[...]

    STRIPE = {
        getToken: function( card, callback ) {
            Stripe.card.createToken( card, function( status, response ) {
                console.log('to callback');
                   callback(response);
            });
        }
    };

    DELAY = [
        {
            "name": "no_delay",
            "duration": 0,
            "title": "None"
        },
        {
            "name": "half_hour",
            "duration": 30,
            "title": "30 minutes"
        },
        {
            "name": "one_hours",
            "duration": 60,
            "title": "1 hours"
        },
        {
            "name": "two_hours",
            "duration": 120,
            "title": "2 hours"
        },
        {
            "name": "three_hours",
            "duration": 180,
            "title": "3 hours"
        },
        {
            "name": "four_hours",
            "duration": 240,
            "title": "4 hours"
        },
         {
            "name": "fourteen_hours",
            "duration": 840, //14 hours
            "title": "14 hours"
        },
        {
            "name": "one_day",
            "duration": 1440,
            "title": "1 day"
        },
        {
            "name": "two_day",
            "duration": 2880,
            "title": "2 day"
        },
        {
            "name": "sixty-two_hours",
            "duration": 3720, //62 hours
            "title": "62 hours"
        },
        {
            "name": "three_day",
            "duration": 4320,
            "title": "3 day"
        },
        {
            "name": "one_week",
            "duration": 10080,
            "title": "1 week"
        },
        {
            "name": "two_week",
            "duration": 20160,
            "title": "2 week"
        },
        {
            "name": "three_week",
            "duration": 30240,
            "title": "3 week"
        },
        {
            "name": "ten_day",
            "duration": 14400,
            "title": "10 days"
        }

    ];
});
