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
Template.dashboard.helpers({
    sessionsReady: function () {
        return Router.current().sessionsHandle.ready();
    },
    sessions: function(){
        return Sessions.find();
    },
    platformName: function(platformId){
        if(Platforms.findOne({_id:platformId}) && Platforms.findOne({_id:platformId}).name)
        return Platforms.findOne({_id:platformId}).name;
    },
    platformImage: function(platformId){
        if(Platforms.findOne({_id:platformId}) && Platforms.findOne({_id:platformId}).image)
        return Platforms.findOne({_id:platformId}).image;
    },
    platformDescription: function(platformId){
        if(Platforms.findOne({_id:platformId}) && Platforms.findOne({_id:platformId}).description)
        return Platforms.findOne({_id:platformId}).description;
    },
    ticketsEnabled: function () {
        Meteor.subscribe('ticketDashboardField');
        return Meteor.user().ticketDashboard;
    }
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

Template.dashboard.onCreated( function() {
    //this.subscribe( 'inbox', chatUserStatus );
});
Template.dashboard.onRendered( function() {
    //this.subscribe( 'inbox', chatUserStatus );
    $('#page-wrapper').addClass('page-wrapper-dashboard');
});
Template.dashboard.onDestroyed( function() {
    //this.subscribe( 'inbox', chatUserStatus );
    $('#page-wrapper').removeClass('page-wrapper-dashboard');
});


Template.dashboard.events({
    'click #redirectTicketManagement': function (event, template) {
        console.log(Meteor.user())
        if(Meteor.user().ticketDashboard){
            Router.go('ticketManagement');
        }else{
            swal({
                title: "Access Denied!",
                text: "It looks like this feature hasn't been activated for your account. If you're interested in learning more, please email us at LetsTalk@getfetch.ca!",
                type: "warning"
            });
        }
    },
    'click #redirectSentimentAnalysis': function (event, template) {
        console.log(Meteor.user())
        if(Meteor.user().sentimentAnalysisDashboard){
            var id = event.currentTarget.dataset.value;
            Router.go('sentimentAnalysis', {_id: id});
        }else{
            swal({
                title: "Access Denied!",
                text: "It looks like this feature hasn't been activated for your account. If you're interested in learning more, please email us at LetsTalk@getfetch.ca!",
                type: "warning"
            });
        }
    },
});