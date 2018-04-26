Template.platformsList.helpers({
    platforms: function () {
        return Platforms.find();
    },

    sessions: function (platformId,type) {
        console.log(platformId,' ',type)
        var sessionData = Sessions.findOne({'platformId': platformId});
        console.log('session',sessionData)
        // console.log('session.secret',session.secret)
        // return Sessions.findOne({platformId: platformId});
        if(type == 'secret'){
            return sessionData.secret;
        }else if(type == 'key'){
            return sessionData.key;
        }
        // return sessionData
    }, 
    showAuthsection : function(platformId){
        if (platformId === 'wGybvHC9m5cZrxeFW') {
            return false
        }
        else {
            return true;
        }
    },

     compare: function(pId){
        var sessionData=Sessions.find().fetch();

        var sessionids = sessionData.map(function(data){
            return data.platformId
        })

        if(sessionids.indexOf(pId) != -1){
            return true
        } else {

            return false
        }

      
    },



    specialLink: function (id) {
        // production shpify id is wGybvHC9m5cZrxeFW
        if (id === 'wGybvHC9m5cZrxeFW') {
            return '/special/' + id;
        }
        else {
            return '/questions/' + id;
        }
    }
});

Template.platformsList.events({
    'click #showSecret': function (event) {
        var divId = Blaze.getData(event.target)._id
        divId = '#'+divId;
        if($(divId).is(':visible')){
            $(divId).addClass('hide');
        }else{
            $(divId).removeClass('hide');
        }
    }
});