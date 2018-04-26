var FILTER_DAYS = 'noOfDays', RATING_SYSTEM = 'ratingSystem', BASE_8 = 'base8',BASE_6 = 'base6', BASE_10 = 'base10';
Session.setDefault(FILTER_DAYS, 0);
Session.setDefault(RATING_SYSTEM, BASE_8);
Session.setDefault('searchbarText', 'Type a keyword...');
Session.setDefault('searchWord', '');

Template.sentimentAnalysis.onCreated(function () {
  Session.set(FILTER_DAYS, 0);
  Session.set(RATING_SYSTEM, BASE_8); // Default ratingSystem BASE_8
  this.subscribe('questions', this.data._id);
  this.filteredQuestionsReady = new ReactiveVar(true);
  this.weHaveResults = new ReactiveVar(false);
  this.ratedQuestionsAvailable = new ReactiveVar(false); // Check on first load, if any rated results available
  this.ratedFilteredQuestionsAvailable = new ReactiveVar(false); // Check on each submit, if any filtered rated results available
  this.filteredResults = new Array();
});
Template.sentimentAnalysis.onDestroyed(function () {
  delete Session.keys['watsonAnalysis']
});

const watsonAnalyze = function (text) {
  var parameters = {
    'text': text,
    'features': {
       'concepts': {
         'limit': 20,
       },
       'keywords': {
         'limit': 20,
       },
       'sentiment': { 'document': true},
       'emotion': { 'document': true },
    }
  };
  console.log('text ===> ',text)
  var totalsyntaxAnalysis = Syntaxanalysetotal.find().fetch();
  if(totalsyntaxAnalysis && totalsyntaxAnalysis.length){
    totalsyntaxAnalysis = totalsyntaxAnalysis[0];
    Session.set('watsonAnalysis', totalsyntaxAnalysis.watsonResult);
    var value = totalsyntaxAnalysis.watsonResult.sentiment.document.score;
    var flag = totalsyntaxAnalysis.watsonResult.sentiment.document.label;
    if (flag == 'negative') {
      value = -Math.abs(value);
    }
    Session.set('chartValue', value);
  }else{
    console.log('No sentiment ')
  }
  // Meteor.callPromise('watsonAnalyze', parameters).then((result) => {
  //   Session.set('watsonAnalysis', result);
    // var value = result.sentiment.document.score;
    // var flag = result.sentiment.document.label;
    // if (flag == 'negative') {
    //   value = -Math.abs(value);
    // }
    // Session.set('chartValue', value);
  // }).catch(err => {
  //   console.log('sentiment err ',err)
  // });
};

const makeBigString = function (response) {
  var firstQuestionString = "";
  var secondQuestionString = "";
  var thirdQuestionString = "";

  var connectedCommentsString = [firstQuestionString, secondQuestionString, thirdQuestionString];

  for (var i = 0; i<response.length; i++) {
    var tempBigString = "";
    for (var j = 0; j<response[i].responses.length; j++) {
      if (response[i].responses[j].hasOwnProperty("comment")) {
        tempBigString += response[i].responses[j].comment + " ";
      }
    }
    connectedCommentsString[i] = tempBigString;
  }
  return connectedCommentsString[0] + connectedCommentsString[1] + connectedCommentsString[2];
};

Template.sentimentAnalysis.onRendered(function () {
// Template.sentimentAnalysis.onRendered(function () {
  var startdate,enddate;
   //var startdate = moment().subtract(29, 'days');
   //var enddate = moment();

  var start = '';
  var end = '';

  function cb(start, end) {
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  }



  $('#reportrange').daterangepicker({
    startDate: moment(),
    endDate: moment(),
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  },cb);

  startdate=new Date(start);
  enddate=new Date(end);

  //startdate.setHours(0,0,0);
  //enddate.setHours(23,59,59);

  var self = Template.instance();

  // Check if any rated questions are available returns true, or false, usefull for loading spinner
  // This get checked once after page render, along with getQuestionResults which returns, empty array or full results
  Meteor.call('ifRatingsAvailable', self.data._id,
  function (err, response) {
    if (err) {
      alert(err);
    }
    else {
      if (response) {
        self.ratedQuestionsAvailable.set(true);
      }
    }
  });
  Meteor.call('getQuestionResults', self.data._id,
  function (err, response) {
    if (err) {
      alert(err);
    }
    else {
      console.log('getQuestionResults ===>',response)
      if (response.length) {
        self.weHaveResults.set(true);
        self.data.filteredResults = response;

        // Determine the ratingSystem used for the dashboard
        Session.set(RATING_SYSTEM, response[0].ratingSystem);

        watsonAnalyze(makeBigString(response));
      }
    }
  });
});

Template.sentimentAnalysis.helpers({
  'sessions': function () {
    return Sessions.find();
  },

  /*'panelHeight': function () {
    var el = $('#right-side-container');
    var commentFilterBox = $('#comment-filter-box');

    return el[0].offsetHeight - commentFilterBox[0].clientHeight - 15 + "px";
  },*/

  'questionsAvailable': function () {

    if (Questions.find().count()) {
      return true;
    }
    return false;
  },
  'ratedQuestionsAvailable': function () {
    console.log('ratedQuestionsAvailable.get() ===> ',Template.instance().ratedQuestionsAvailable.get())
    return Template.instance().ratedQuestionsAvailable.get();
    // return true;
  },
  'ratedFilteredQuestionsAvailable': function () {
    return Template.instance().ratedFilteredQuestionsAvailable.get();
  },
  'checkTotalCommentExist': function () {
    var syntaxAnalysisTotal = Syntaxanalysetotal.find().fetch();
    if(syntaxAnalysisTotal && syntaxAnalysisTotal.length){
      return true;
    }else{
      return false;
    }
  },
  'checkCommentExist': function () {
    var syntaxAnalysis = Syntaxanalyse.find().fetch();
    if(syntaxAnalysis && syntaxAnalysis.length){
      return true;
    }else{
      return false;
    }
  },
  'firstLoad': function () {
    var self = Template.instance();
    console.log('self.weHaveResults.get() -=====> ',self.weHaveResults.get())
    // Checks if on first time page load only!
    // if (self.weHaveResults.get()) {
    if (self.weHaveResults.get()) {
      return true;
    }
    return false;
  },
  'filteredQuestionsAvailable': function () {
    var self = Template.instance();

    // Checks if it is the first time page is loading!
    if (Session.get(FILTER_DAYS) == "0") {
      // If we are here, we have rated first time results NOT filtered results!
      return true;
    }
    else if (Session.get(FILTER_DAYS) != "0" && self.ratedFilteredQuestionsAvailable.get()) {
      // If we are here, we have filtered results!
      return true;
    }
    return false;
  },
  'filteredQuestions': function () {
    // If we are here, all meteor calls to get results have returned and we have data!
    if (Session.get(FILTER_DAYS)) {
    }
    else {
    }
    watsonAnalyze(makeBigString(this.filteredResults));
    return this.filteredResults;
  },

  'filteredQuestionsReady': function () {
    return Template.instance().filteredQuestionsReady.get();
  },

  'searchbarText': function () {
    //Session.set('searchbarText', document.getElementById('searchBox'));
    return Session.get('searchbarText');
  }
});


Template.sentimentAnalysis.events({
  'submit #filter-days': function (event, template) {
    event.preventDefault();

    //var numberOfDays = template.find("#noOfDays").value;

    //------------------FOR DATE PICKER WITH PRE DEFINED RANGES---------------
    var Dates = template.find("#reportrange span").innerHTML;

    //-------------------FOR ORDINARY DATE PICKER-----------------------------
    // var Dates = template.find("#reportrange").value;
    if(Dates){

      var resDate = Dates.split(" - ");

      var startDate=new Date(resDate[0]);  // Start Date
      var endDate=new Date(resDate[1]);  // End Date


      startDate.setHours(0,0,0);
      endDate.setHours(23,59,59);


      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

      var numberOfDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay))); //Getting thye difference betwwen startdate and enddate
      if(numberOfDays==0){
        numberOfDays=1;
      }
      //converting into ISO format date
      // startDate=startDate.toISOString();
      // endDate=endDate.toISOString();

      if (startDate && endDate) {
        // Lock chart drawing until results are ready
        template.filteredQuestionsReady.set(false);

        Meteor.call('ifRatingsAvailable', template.data._id,startDate,endDate,
        function (err, response) {
          if (err) {
            alert(err);
          }
          else {
            if (response) {
              template.ratedFilteredQuestionsAvailable.set(true);
            }
            else {
              template.ratedFilteredQuestionsAvailable.set(false);
            }
          }
        });

        Meteor.call('getQuestionResults', template.data._id,startDate,endDate,
        function (err, response) {
          if (err) {
            alert(err);
          }
          else {
            template.data.filteredResults = response;
            Session.set(FILTER_DAYS, Number(numberOfDays));

            if (response.length) {
              // Determine the ratingSystem used for the dashboard
              Session.set(RATING_SYSTEM, response[0].ratingSystem);
            }
            // Unlock chart drawing
            template.filteredQuestionsReady.set(true);
          }
        });
      }
      else {
        // Do nothing!!! (show whatever was on the screen before)
        // Leave Session.get(FILTER_DAYS) as old value! (prevents page reload)
      }
    }else{
    }
  },
  'submit #filter-search': function (event, template) {
    event.preventDefault();
    sessionSearchbarText = Session.get('searchbarText');
    fieldSearchbarText = document.getElementById('searchBox').value;

    if(fieldSearchbarText == 'Type a keyword...'){
      //don't do anything
    }
    else if(sessionSearchbarText == fieldSearchbarText) {
      Session.set('searchWord', sessionSearchbarText);
    } else {
      Session.set('searchWord', fieldSearchbarText);
    }
  }
});
