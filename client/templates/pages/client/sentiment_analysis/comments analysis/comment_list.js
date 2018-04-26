var LIST_HEADER_HEIGHT = 270; // offset distance for the list from the panel top
var NUMBER_TO_SHOW = 10; // number of responses to show each time.
var RATING_SYSTEM = 'ratingSystem', BASE_8 = 'base8',BASE_6 = 'base6', BASE_10 = 'base10';

Template.commentList.onCreated(function () {
  // Reactive variable to indicate end of list
  this.noMore = new ReactiveVar(false);
  this.noMoreAll = new ReactiveVar(false);
  this.filteredAllResults = new ReactiveVar();

  // Instance variables to store all responses from context
  var responseDataWithOnlyComments = [];
  for (var i=0; i < Template.currentData().inputData.length; i++){
    if (Template.currentData().inputData[i].comment) {
      responseDataWithOnlyComments.push(Template.currentData().inputData[i]);
    }
  }
  this.data.responseData = responseDataWithOnlyComments;
  // Instance variables to store only selected response type and number
  this.data.allResponses = [];
  this.data.allResponsesIndex = this.data.responseData.length - 1;;

  // Preload first batch of rated responses.
  // All responses for both BASE_8 and BASE_10
  var count = 0;
  while (this.data.allResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
      this.data.allResponses.push(this.data.responseData[this.data.allResponsesIndex]);
      count++;
      this.data.allResponsesIndex--;
  }

  if (Session.get(RATING_SYSTEM) == BASE_8) {
      // Store the first batch of rated responses.
      this.filteredAllResults.set(this.data.allResponses);

      // Update end of list index trackers if no more rated results available
      this.noMoreAll.set(this.data.allResponsesIndex < 0);
  }
  else if (Session.get(RATING_SYSTEM) == BASE_10) {
      // Store the first batch of rated responses.
      this.filteredAllResults.set(this.data.allResponses);
      // Update end of list index trackers if no more rated results available
      this.noMoreAll.set(this.data.allResponsesIndex < 0);
  }
  else if(Session.get(RATING_SYSTEM) == BASE_6) {
    // Store the first batch of rated responses.
    this.filteredAllResults.set(this.data.allResponses);
    // Update end of list index trackers if no more rated results available
    this.noMoreAll.set(this.data.allResponsesIndex < 0);
  }
});

Template.commentList.helpers({
  'ratingSystemBase10': function() {
    return Session.get(RATING_SYSTEM) == BASE_10;
  },

  'noMore': function () {
    var self = Template.instance();
    return self.noMoreAll.get();
  },

  'responseListData': function() {
    var preSearchData = Template.instance().filteredAllResults.get();
    var searchWord = Session.get('searchWord');
    var searchResult = [];

    if (searchWord != ''){ //if there is a search
      for (var i = 0; i < preSearchData.length; i++) {
        if (preSearchData[i].keywords) {
          var addedFlag = false;
          for (var j = 0; j < preSearchData[i].keywords.length; j++) {
            if(preSearchData[i].keywords[j].text == searchWord){
              searchResult.push(preSearchData[i]);
              addedFlag = true; //add to results
              //if the searched keyword is found in the keywords from watson
            }
          }
          if(preSearchData[i].comment.indexOf(searchWord) !== -1 && addedFlag != true){
            searchResult.push(preSearchData[i]) //add to results
            //if the searched word is found in the comment text
          }
        }
      }
      return searchResult;
    } else {
      return preSearchData;
    }
  },

});

Template.commentList.events({
    'click #show-more': function (event, template) {
        event.preventDefault();
        // Load next batch of rated responses.
        var ratingValue = 0;
        var count = 0;
        if (Session.get(RATING_SYSTEM) == BASE_8) {
            if (template.filterType.get() == 'all') {
                while (template.data.allResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    template.data.allResponses.push(template.data.responseData[template.data.allResponsesIndex]);
                    count++;
                    template.data.allResponsesIndex--;
                }
                template.filteredAllResults.set(template.data.allResponses);
            }
            // Update end of list index trackers if no more rated results available
            template.noMoreAll.set(template.data.allResponsesIndex < 0);
        }
        // Promoters, Passives, and Detractors Responses if base10
        else if (Session.get(RATING_SYSTEM) == BASE_10) {
          while (template.data.allResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
              template.data.allResponses.push(template.data.responseData[template.data.allResponsesIndex]);
              count++;
              template.data.allResponsesIndex--;
          }
          template.filteredAllResults.set(template.data.allResponses);
            // Update end of list index trackers if no more rated results available
            template.noMoreAll.set(template.data.allResponsesIndex < 0);
        }else if(Session.get(RATING_SYSTEM) == BASE_6) {
          while (template.data.allResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
              template.data.allResponses.push(template.data.responseData[template.data.allResponsesIndex]);
              count++;
              template.data.allResponsesIndex--;
          }
          template.filteredAllResults.set(template.data.allResponses);
          // Update end of list index trackers if no more rated results available
          template.noMoreAll.set(template.data.allResponsesIndex < 0);
        }
    }
});
