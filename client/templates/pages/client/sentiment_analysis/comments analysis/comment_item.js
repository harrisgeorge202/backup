var RATING_SYSTEM = 'ratingSystem', BASE_8 = 'base8',BASE_6 = 'base6', BASE_10 = 'base10';
Session.setDefault('readyFlag', false);

Template.sentimentCommentItem.onCreated(function () {
  this.data.readyFlag = new ReactiveVar(false);
  var parameters = {
    'text': this.data.comment,
    'features': {
      'concepts': {
      },
      'keywords': {
      },
      'sentiment': { 'document': true},
      'emotion': { 'document': true },
    }
  };
  var syntaxAnalysis = Syntaxanalyse.findOne({comment : this.data.comment});
  if(syntaxAnalysis && syntaxAnalysis._id){
    this.data.keywords = syntaxAnalysis.watsonResult.keywords;
    this.data.sentiment = syntaxAnalysis.watsonResult.sentiment.document;
    this.data.emotion = syntaxAnalysis.watsonResult.emotion.document.emotion;
    this.data.readyFlag.set(true);
  }else{
    console.log('No sentiment single comment')
  }
  // Meteor.callPromise('watsonAnalyze', parameters).then((result) => {
    // this.data.keywords = result.keywords;
    // this.data.sentiment = result.sentiment.document;
    // this.data.emotion = result.emotion.document.emotion;
    // this.data.readyFlag.set(true);
  // }).catch(err => {
  //   console.log('comment err ',err)
  // });
});

Template.sentimentCommentItem.helpers({

  'checkCommentExist': function () {
    var self = Template.currentData();
    console.log('this.data.comment ',self)
    var syntaxAnalysis = Syntaxanalyse.findOne({comment : self.comment});
    if(syntaxAnalysis && syntaxAnalysis._id){
      return true;
    }else{
      return false;
    }
  },
  'analysisReady': function () {
    var self = Template.currentData();
    return self.readyFlag.get();
  },

  'ratingWithSign': function () {
    var instance = Template.currentData();

    if (Session.get(RATING_SYSTEM) == BASE_8) {
      return (instance.rating < 0 ? '' : '+') + instance.rating;
    } else if (Session.get(RATING_SYSTEM) == BASE_10) {
      return instance.rating;
    } else if (Session.get(RATING_SYSTEM) == BASE_6) {
      return instance.rating;
    }
  },

  'ratingColor': function () {
    var instance = Template.currentData();
    if (Session.get(RATING_SYSTEM) == BASE_8) {
      if (instance.rating < 0) {
          return "#d9534f";
      }
      return "#5cb85c";
    } else if (Session.get(RATING_SYSTEM) == BASE_10) {
        // If we want three color rating bubbles
        if (instance.rating >= 9) {
            return "#5cb85c";
        } else if (instance.rating >= 7) {
            return "#f0ad4e";
        } else {
            return "#d9534f";
        }
    } else if(Session.get(RATING_SYSTEM) == BASE_6) {
      // If we want three color rating bubbles
        if (instance.rating == 5) {
          return "#5cb85c";
        } else if (instance.rating == 4) {
            return "#f0ad4e";
        } else {
            return "#d9534f";
        }
    }
  },

  'sentimentColor': function () {
    var instance = Template.currentData();
    if (instance.sentiment.label == 'positive') {
        return "#5cb85c";
    } else {
        return "#d9534f";
    }
  },

  'overallSentiment': function () {
    var instance = Template.currentData();
    var sentimentScore = 0;
    var satisfiedStatus = '';
    if (instance.sentiment.label == 'negative') {
      sentimentScore = Math.round(((1 + -Math.abs(instance.sentiment.score))/2)*100);
      satisfiedStatus = 'Dissatisfied';
    } else {
      sentimentScore = Math.round(((1 + instance.sentiment.score)/2)*100);
      satisfiedStatus = 'Satisfied';
    }

    return 'Overall ' + satisfiedStatus + ' (' + sentimentScore + '%)';
  },

  //helper functions for building the emotion analysis graphs
  'happiness': function () {
    var instance = Template.currentData();
    return '<span style="color: #F57F17">'+ Math.round(instance.emotion.joy*100) + '%</span>';
  },
  'anger': function () {
    var instance = Template.currentData();
    return '<span style="color: rgb(255, 99, 132)">'+ Math.round(instance.emotion.anger*100) + '%</span>';
  },
  'disappointment': function () {
    var instance = Template.currentData();
    return'<span style="color: rgb(139, 195, 74)">'+ Math.round(instance.emotion.disgust*100) + '%</span>';
  },
  'unhappiness': function () {
    var instance = Template.currentData();
    return '<span style="color: rgb(54, 162, 235)">'+ Math.round(instance.emotion.sadness*100) + '%</span>';
  },
  'anxiety': function () {
    var instance = Template.currentData();
    return '<span style="color: rgb(153, 102, 255)">'+ Math.round(instance.emotion.fear*100) + '%</span>';
  },

});
