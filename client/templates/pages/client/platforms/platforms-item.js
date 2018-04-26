Template.platformsItem.helpers({
    sessions: function () {
        console.log(this._id);
        return Sessions.find();
    },
    sessionReady: function () {
        return Router.current().sessionHandle.ready();
    },
    createSession:function(){
        Meteor.call('createKeys',this._id);
        console.log('called createKeys with'+this._id);
        return 'Creating New Keys...';
    }
});