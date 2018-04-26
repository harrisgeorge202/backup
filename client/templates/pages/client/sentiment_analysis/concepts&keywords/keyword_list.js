function buildKeywords() {
  if (Session.get('watsonAnalysis')){
    var watson = Session.get('watsonAnalysis');
    var keywordsList = watson.keywords;
    var result = new Array(keywordsList.length);
    for (i = 0; i < keywordsList.length; i++){
      result[i] = { text: keywordsList[i].text, relevance: Math.round(keywordsList[i].relevance*100) }
    };
    Session.set('keywords', result);
  }else{
    Session.set('keywords', [{ text: 'loading...', relevance: 0 }]);
  }
}

Template.keywordsList.onRendered(function() {
  buildKeywords();
});

Template.keywordsList.helpers({
  keywords: function() {
    buildKeywords();
    return Session.get('keywords')
   }
});

Template.keywordsList.events({
  'click .keyword-item': function (event, template) {
    event.preventDefault();
    var keywordText = event.target.outerText;
    keywordText = keywordText.replace(/(\r\n|\n|\r)/gm,"");
    keywordText = keywordText.replace(/[0-9]/g, '');

    Session.set('searchbarText', keywordText); //fix this
  }
})
