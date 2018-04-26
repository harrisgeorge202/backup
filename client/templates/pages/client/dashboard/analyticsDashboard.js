/*Template.paymentView.created = function () {
    console.log("test this");
    var self = this;
    self.myAsyncValue = new ReactiveVar("Waiting for response from server...");
    Meteor.call('getHisCards', function (err, asyncValue) {
        if (err)
            console.log(err);
        else
            self.myAsyncValue.set(asyncValue);
    });
}*/



/**
 * Created by baboon-soft on 18/1/16.
 */
Template.analyticsDashboard.helpers({
    sessionsReady: function () {
        return Router.current().sessionsHandle.ready();
    },
    sessions: function(){
        return Sessions.find();
    },
    platformName: function(platformId){
        return Platforms.findOne({_id:platformId}).name;
    },
    platformImage: function(platformId){
        return Platforms.findOne({_id:platformId}).image;
    },
    platformDescription: function(platformId){
        return Platforms.findOne({_id:platformId}).description;
    },
    /*,
    savedCards: function () {
        var cards = Template.instance().myAsyncValue.get();
        if (cards.statusCode && cards.statusCode !== 200) {
            alert(cards.message);
        }
        else {
            console.log(cards);
            if (cards.object && cards.object === "list") {
                this.savedCard = function(){
                    return cards.data;
                };
                return true;
            }
            else {
                return false;
            }
        }
    }*/
});

Template.analyticsDashboard.onCreated( function() {
    //this.subscribe( 'inbox', chatUserStatus );
});
