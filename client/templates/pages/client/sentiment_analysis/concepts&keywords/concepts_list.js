function buildConcepts() {
  if (Session.get('watsonAnalysis')){
    var watson = Session.get('watsonAnalysis');
    var conceptsList = watson.concepts;
    var result = new Array(conceptsList.length);
    for (i = 0; i < conceptsList.length; i++){
      result[i] = { text: conceptsList[i].text, relevance: Math.round(conceptsList[i].relevance*100) }
    };
    Session.set('concepts', result);
  }else{
    Session.set('concepts', [{ text: 'loading...', relevance: 0 }]);
  }
}

Template.conceptsList.onRendered(function() {
  buildConcepts();
});

Template.conceptsList.helpers({
  concepts: function() {
    buildConcepts();
    return Session.get('concepts')
   }

});

 /* Uncomment this if you want the concepts to be clickable
Template.concept.events({
  'click #concept-item': function (event, template) {
    console.log('concept is clicked ', event.target.outerText);
    event.preventDefault();
    var conceptText = event.target.outerText;
    conceptText = conceptText.replace(/(\r\n|\n|\r)/gm,"");
    conceptText = conceptText.replace(/[0-9]/g, '');

    Session.set('searchbarText', conceptText); //fix this
  }
});
*/
