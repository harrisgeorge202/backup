var FILTER_DAYS = 'noOfDays', RATING_SYSTEM = 'ratingSystem', BASE_6 = 'base6', BASE_8 = 'base8', BASE_10 = 'base10';
Session.setDefault(FILTER_DAYS, 0);
Session.setDefault(RATING_SYSTEM, BASE_8);

/**
 * Created by baboon-soft on 18/1/16.
 */
Template.dashboardList.onCreated(function () {
    console.log("Inside dashboardList onCreated...");
    Session.set(FILTER_DAYS, 0);
    Session.set(RATING_SYSTEM, BASE_8); // Default ratingSystem BASE_8
    this.subscribe('questions', this.data._id);
    this.filteredQuestionsReady = new ReactiveVar(true);
    this.weHaveResults = new ReactiveVar(false);
    this.ratedQuestionsAvailable = new ReactiveVar(false); // Check on first load, if any rated results available
    this.ratedFilteredQuestionsAvailable = new ReactiveVar(false); // Check on each submit, if any filtered rated results available
    this.filteredResults = new Array();
});

Template.dashboardList.onRendered(function () {
    console.log("Inside dashboardList onRendered...");

    // TODO: alternate solution to load only last 30 days to make loading faster
    // If we want to auto load last 30 days of ratings instead of ALL time ratings.
    //var numberOfDays = 30;
    //Session.set(FILTER_DAYS, 30);

    var self = Template.instance();

    // Check if any rated questions are available returns true, or false, usefull for loading spinner
    // This get checked once after page render, along with getQuestionResults which returns, empty array or full results
    Meteor.call('ifRatingsAvailable', self.data._id,
        function (err, response) {
            console.log("Got callback from ifRatingsAvailable?");
            console.log(err);
            console.log(response);
            if (err) {
                alert(err);
            }
            else {
                console.log("Setting ratedQuestionsAvailable to response");
                if (response) {
                    self.ratedQuestionsAvailable.set(true);
                    console.log("ratedQuestionsAvailable: true");
                }
                else {
                    console.log("ratedQuestionsAvailable: false");
                }
            }
        });

    Meteor.call('getQuestionResults', self.data._id,
        function (err, response) {
            console.log("Got callback from getQuestionResults?");
            console.log(err);
            console.log(response);
            if (err) {
                alert(err);
            }
            else {
                console.log("Setting questionResults to response after first load");
                if (response.length) {
                    self.weHaveResults.set(true);
                    self.data.filteredResults = response;

                    // Determine the ratingSystem used for the dashboard
                    Session.set(RATING_SYSTEM, response[0].ratingSystem);
                    console.log("RATING_SYSTEM: ", response[0].ratingSystem);
                }
            }
        });
});

Template.dashboardList.helpers({
    csvLink: function (resultObj) {
        var nod = Session.get(FILTER_DAYS);
        console.log("Calling csvLink...");

        if (nod) {
            return "/exportUsers/" + resultObj.questionId + "_" + nod + ".csv";
        }
        else {
            return "/exportUsers/" + resultObj.questionId + ".csv";
        }
    },
    questionsAvailable: function () {
        if (Questions.find().count()) {
            console.log("questionsAvailable: true");
            return true;
        }
        console.log("questionsAvailable: false");
        return false;
    },
    ratedQuestionsAvailable: function () {
        return Template.instance().ratedQuestionsAvailable.get();
    },
    ratedFilteredQuestionsAvailable: function () {
        return Template.instance().ratedFilteredQuestionsAvailable.get();
    },
    firstLoad: function () {
        var self = Template.instance();
        console.log("Inside firstLoad helper in dashboardList...");

        // Checks if on first time page load only!
        if (self.weHaveResults.get()) {
            console.log("firstLoad: true (All Questions)");
            return true;
        }
        return false;
    },
    filteredQuestionsAvailable: function () {
        var self = Template.instance();
        console.log("Inside filteredQuestionsAvailable helper in dashboardList...");

        // Checks if it is the first time page is loading!
        if (Session.get(FILTER_DAYS) == "0") {
            // If we are here, we have rated first time results NOT filtered results!
            return true;
        }
        else if (Session.get(FILTER_DAYS) != "0" && self.ratedFilteredQuestionsAvailable.get()) {
            // If we are here, we have filtered results!
            console.log("filteredQuestionsAvailable: true (Filtered Questions)");
            return true;
        }
        console.log("filteredQuestionsAvailable: false");
        return false;
    },
    filteredQuestions: function () {
        // If we are here, all meteor calls to get results have returned and we have data!
        console.log("Inside filteredQuestions helper in dashboardList...");
        if (Session.get(FILTER_DAYS)) {
            console.log("filteredQuestions -> Returning just filtered responses: ", this.filteredResults);
        }
        else {
            console.log("filteredQuestions -> Returning all responses: ", this.filteredResults);
        }
        return this.filteredResults;
    },
    filteredQuestionsReady: function () {
        return Template.instance().filteredQuestionsReady.get();
    }
});

Template.dashboardList.events({
    'submit #filter-days': function (event, template) {
        event.preventDefault();

        var numberOfDays = template.find("#noOfDays").value;
        console.log("Submit is clicked: numberOfDays = ", numberOfDays);

        if (!isNaN(numberOfDays) && numberOfDays > 0) {
            // Lock chart drawing until results are ready
            template.filteredQuestionsReady.set(false);

            Meteor.call('ifRatingsAvailable', template.data._id, Number(numberOfDays),
                function (err, response) {
                    console.log("Got callback from ifRatingsAvailable with noOfDays?");
                    console.log(err);
                    console.log(response);
                    if (err) {
                        alert(err);
                    }
                    else {
                        console.log("Setting ratedFilteredQuestionsAvailable to response");
                        if (response) {
                            template.ratedFilteredQuestionsAvailable.set(true);
                            console.log("ratedFilteredQuestionsAvailable: true");
                        }
                        else {
                            template.ratedFilteredQuestionsAvailable.set(false);
                            console.log("ratedFilteredQuestionsAvailable: false");
                        }
                    }
                });

            Meteor.call('getQuestionResults', template.data._id, Number(numberOfDays),
                function (err, response) {
                    console.log("Got callback from getQuestionResults with noOfDays?");
                    console.log(err);
                    console.log(response);
                    if (err) {
                        alert(err);
                    }
                    else {
                        console.log("Setting filteredResults to response");
                        template.data.filteredResults = response;
                        Session.set(FILTER_DAYS, Number(numberOfDays));

                        if (response.length) {
                            // Determine the ratingSystem used for the dashboard
                            Session.set(RATING_SYSTEM, response[0].ratingSystem);
                            console.log("RATING_SYSTEM: ", response[0].ratingSystem);
                        }
                        // Unlock chart drawing
                        template.filteredQuestionsReady.set(true);
                    }
                });
        }
        else {
            console.log("Submit is 0 or null");
            // Do nothing!!! (show whatever was on the screen before)
            // Leave Session.get(FILTER_DAYS) as old value! (prevents page reload)
        }
    }
});


// results variable format...
//
// results = [
//   {
//      'ratingSystem'  : ratingSystem,
//      'questionId'    : question._id,
//      'questionText'  : question.text,
//      'total'         : 0,
//      'average'       : 0,
//      'negative'      : 0,
//      'positive'      : 0,
//      'detractors'    : 0,
//      'passives'      : 0,
//      'promoters'     : 0,
//      'rating'        : [0, 0, 0, 0, 0, 0, 0, 0],
//      'responses'     : [{'name': name, 'email': email, 'ratedOn': date, 'rating': rating, 'comment', comment}, ...]]
//   },
//   ...
// ];
//
// negative and positive fields are available only in BASE_8 ratingSystem
// detractors, passives, and promoters fields are available only in BASE_6 and BASE_10 ratingSystem
// rating array is length 6, 8, or 10 based on ratingSystem type
