
Template.commentAnalysis.onCreated(function () {

  this.numberOfQuestions = new ReactiveVar(3);
});
Template.commentAnalysis.onRendered(function () {
  console.log('onRendered')
});

Template.commentAnalysis.helpers({
  'oneQuestion': function() {
    var questionResults = Template.currentData().inputData;
    var numberOfQuestions = questionResults.length;
    return numberOfQuestions == 1;
  },
  'twoQuestions': function() {
    var questionResults = Template.currentData().inputData;
    var numberOfQuestions = questionResults.length;
    return numberOfQuestions == 2;
    // return Template.instance().numberOfQuestions.get() == 2;
  },
  'threeQuestions': function() {
    var questionResults = Template.currentData().inputData;
    var numberOfQuestions = questionResults.length;
    return numberOfQuestions == 3;
    // return Template.instance().numberOfQuestions.get() == 3;
  },
  'question1Responses': function () {
    if (Template.instance().numberOfQuestions.get() >= 1) {
      return Template.currentData().inputData[0].responses;
    }
  },
  'question2Responses': function () {
    if (Template.instance().numberOfQuestions.get() >= 2) {
      return Template.currentData().inputData[1].responses;
    }
  },
  'question3Responses': function () {
    if (Template.instance().numberOfQuestions.get() == 3) {
      return Template.currentData().inputData[2].responses;
    }
  },
  'question1Text': function () {
    if (Template.instance().numberOfQuestions.get() >= 1) {
      return Template.currentData().inputData[0].questionText;
    }
  },
  'question2Text': function () {
    console.log('Template.currentData().inputData[1] ==== >',Template.currentData().inputData[1])
    if (Template.instance().numberOfQuestions.get() >= 2) {
      return Template.currentData().inputData[1].questionText;
    }
  },
  'question3Text': function () {
    console.log('Template.currentData().inputData[2] ==== >',Template.currentData().inputData[2])
    if (Template.instance().numberOfQuestions.get() == 3) {
      return Template.currentData().inputData[2].questionText;
    }
  }
});
