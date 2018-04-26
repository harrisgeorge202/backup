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

var FILTER_DAYS = 'noOfDays';
Session.setDefault(FILTER_DAYS, 0);

/**
 * Created by baboon-soft on 18/1/16.
 */
Template.adminDashboardList.helpers({
    questionsReady: function () {
        return true; //Router.current().sessionsHandle.ready();
    },
    questions: function () {
        console.log("this._id in dashboardList");
        console.log(this._id);
        console.log(Questions.find());
        return Questions.find();
    },
    averageRating: function (Question) {
        var avg = Question.totalRating / Question.totalCount;
        if (isNaN(avg)) {
            return "No one rated yet!";
        }
        else {
            return +avg.toFixed(2);
        }
    },
    csvLink: function (Question) {
        var avg = Question.totalRating / Question.totalCount;
        var nod = Session.get(FILTER_DAYS);
        /*if (isNaN(avg)) {
         return "#";
         }
         else {*/
        if(nod){
            return "/exportUsers/" + Question._id + "_" + nod+  ".csv";
        }
        else {
            return "/exportUsers/" + Question._id + ".csv";
        }
        //}
    },
    previousRoute: function () {
        return {
            path: this.previousPath,
            name: "Users"
        };
    },
    filteredResults: function () {
        console.log("!Session.get(FILTER_DAYS)");
        console.log(Session.get(FILTER_DAYS));
        console.log(!!Session.get(FILTER_DAYS));
        return !!Session.get(FILTER_DAYS);
    },
    filteredBloomResults: function () {
        if (Session.get(FILTER_DAYS)) {
            console.log("returning filteredQuestions");
            console.log(this);
            return this.filteredQuestions;
        }
        else {
            console.log("empty");
            return [];
        }
    }
});

Template.adminDashboardList.events({
    'submit #filter-days': function (event, template) {
        event.preventDefault();
        console.log(template);
        console.log(template.find("#noOfDays").value);

        var numberOfDays = template.find("#noOfDays").value;

        if (!isNaN(numberOfDays) && numberOfDays) {
            console.log('Session set to ', Session.get(FILTER_DAYS));
            Meteor.call('getAverageRating', template.data.platform._id, Number(numberOfDays), template.data.userId,
                function (err, response) {
                    console.log("got callback?");
                    console.log(err);
                    console.log(response);
                    if (err) {
                        alert(err);
                    }
                    else {
                        console.log("setting TestLoad");
                        template.data.filteredQuestions = response;
                        Session.set(FILTER_DAYS, Number(numberOfDays));
                    }
                });
        }
        else {
            Session.set(FILTER_DAYS, 0);
        }
    }
});

Template.adminDashboardList.onCreated(function () {
    this.subscribe('questions', this.data.platform._id, this.data.userId);
});
