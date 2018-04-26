var OVERVIEW_CHART_HEIGHT = 385; // 385px plus 20px bottom-padding (less 20 for bottom)
var QUESTION_CHART_HEIGHT = 335; // 315px plus 20px bottom-padding

Template.recentRespondents.onCreated(function () {
    console.log("Inside recentRespondents onCreated...");
    
    // Actual width: 352px + 1px border on each side!
    this.panelHeight = new ReactiveVar(1390); // default 1 overview + 3 questions height
    this.numberOfQuestions = new ReactiveVar(3);
});

Template.recentRespondents.onRendered(function () {
    console.log("Inside recentRespondents onRendered...");
    // Nothing here!
});

Template.recentRespondents.helpers({
    'panelHeight': function () {
        var self = Template.instance();
        var questionResults = Template.currentData().inputData;
        var numberOfQuestions = questionResults.length;

        self.panelHeight.set(OVERVIEW_CHART_HEIGHT + numberOfQuestions * QUESTION_CHART_HEIGHT);
        self.numberOfQuestions.set(numberOfQuestions);
        return self.panelHeight.get();
    },
    'oneQuestion': function() {
        return Template.instance().numberOfQuestions.get() == 1;
    },
    'twoQuestions': function() {
        return Template.instance().numberOfQuestions.get() == 2;
    },
    'threeQuestions': function() {
        return Template.instance().numberOfQuestions.get() == 3;
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
        if (Template.instance().numberOfQuestions.get() >= 2) {
            return Template.currentData().inputData[1].questionText;
        }
    },
    'question3Text': function () {
        if (Template.instance().numberOfQuestions.get() == 3) {
            return Template.currentData().inputData[2].questionText;
        }
    }
});

Template.recentRespondents.events({
    // Nothin here!
});