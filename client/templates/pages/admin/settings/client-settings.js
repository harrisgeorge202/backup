/**
 * Created by baboon-soft on 31/12/15.
 */
/*var options = {
 keepHistory: 1000 * 60 * 5,
 localSearch: true
 };
 var fields = ['name', 'stripeId'];

 PackageSearch = new SearchSource('packages', fields, options);*/

 Template.clientSettingsForm.onRendered(function (){
    console.log('onRendered ')
    var user=Meteor.users.findOne({_id: Router.current().params._id});
    console.log('user ',user)
    if(user.settings.scaleType=='base8'){
        $('#showDynamicPageLanding').hide();
        $('#showTicketManagement').hide();
        $('#showSentmentAnalysis').hide();
    }else if(user.settings.scaleType=='base10'){
        $('#showDynamicPageLanding').show();
        $('#showTicketManagement').show();
        $('#showSentmentAnalysis').show();
    }else if(user.settings.scaleType=='base6'){
        $('#showDynamicPageLanding').show();
        $('#showTicketManagement').show();
        $('#showSentmentAnalysis').show();
    }
  });

 Template.clientSettingsForm.helpers({
    usersReady: function () {
        return Router.current().usersHandle.ready();
    },
    user: function () {
        console.log(Router.current().params._id)
        if(Router.current().params._id) {
            return Meteor.users.findOne({_id: Router.current().params._id});
        } else {
            return null
        }
    },
     findPackage: function () {
         var obj=Meteor.users.findOne({_id: Router.current().params._id})
         console.log(obj.packageId)
        return obj.packageId
    },
     platformsExists: function () {
        return Platforms.find().fetch().length;
    },
    platforms: function () {
        return Platforms.find();
    },
     session: function () {
        return Sessions.find();
    },
    scale: function(){
        var user=Meteor.users.findOne({_id: Router.current().params._id});
        return user.settings.scaleType;
    },
    showData: function(){
        var user=Meteor.users.findOne({_id: Router.current().params._id});
          if(user.settings.scaleType=='base8'){
            console.log("false")
            return false;
        }else if(user.settings.scaleType=='base10'){
            console.log("true")
            return true;
        }else if(user.settings.scaleType=='base6'){
            console.log("true")
            return true;
        }
    },
    defaultscale: function(){
        var user=Meteor.users.findOne({_id: Router.current().params._id});
        console.log(user.settings.scaleType)
        if(user.settings.scaleType=='base8'){
            console.log("true")
            return true;
        }else{
            console.log("false")
            return false;
        }

    },
    compareScale:function(scaleType){
        var user=Meteor.users.findOne({_id: Router.current().params._id});

        if(user.settings.scaleType== scaleType){
            return true;
        }else{
            return false;
        }
    },
    compare: function(pId){
        var sessionData=Sessions.find().fetch();

        var sessionids = sessionData.map(function(data){
            return data.platformId
        })

        console.log(sessionids)

        if(sessionids.indexOf(pId) != -1){
            return true
        } else {

            return false
        }

      
    },
    packages: function () {
        return Packages.find();
    }/*,testDee: function (packageName) {
        //console.log('Template.parentData(1)');
        //console.log(Template.parentData(1));
        return (Template.parentData(1).packageId === packageName) ? "selected" : "";
    }*/


});

Template.clientSettingsForm.events({
    "submit #client-add-settings-form": function (event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        var packageId=template.$('[name=packageSelection]').val()
        var pId = template.findAll('[name=platform]:checked');
        var notpId = template.findAll('[name=platform]:unchecked');
        var notification_value=[];
        var availableSMS = template.$('[name=availableSMS]').is(":checked");


        var pIds = _.map(pId, function(item) {
        return item.defaultValue;
        });

        var notpIds = _.map(notpId, function(item) {
            return item.defaultValue;
        });
        var rating=template.$('[name=ratingSelection]').val();
        console.log('ratingggg ===> ',rating)
        if(!rating){
            rating='base8';
        }
        var dynamicpage=template.$('[name=dynamicPageLanding]').is(":checked");
        var ticketDashboard=template.$('[name=ticketDashboard]').is(":checked");
        var sentimentAnalysisDashboard=template.$('[name=sentimentAnalysisDashboard]').is(":checked");
        if(rating=='base10'){
            notification_value.push(6)
        }else if(rating=='base6'){
            notification_value.push(3)
        }else{
            notification_value.push(-1)
        }
        if(rating=='base8'){
            dynamicpage=false,
            ticketDashboard = false;
            sentimentAnalysisDashboard = false;
        }
        // if(rating!='base6'){
        //     dynamicpage='false'
        // }
        if(availableSMS) {
            var details = {
                $set: {
                    "settings.brandingCustomization": template.$('[name=brandingCustomization]').is(":checked"),
                    "settings.scaleType": rating,
                    "settings.availableSMS": availableSMS,
                    "settings.dynamicPageLanding": dynamicpage,
                    "settings.notification_value": notification_value ,
                    "ticketDashboard":ticketDashboard,
                    "sentimentAnalysisDashboard":sentimentAnalysisDashboard,
                }
            };
        } else {
            var details = {
                $set: {
                    "settings.brandingCustomization": template.$('[name=brandingCustomization]').is(":checked"),
                    "settings.scaleType": rating,
                    "settings.availableSMS": availableSMS,
                    "settings.smsNotification": false,
                    "settings.dynamicPageLanding": dynamicpage,
                    "settings.notification_value": notification_value,
                    "ticketDashboard":ticketDashboard,
                    "sentimentAnalysisDashboard":sentimentAnalysisDashboard 
                }
            };
        }

        console.log(details);
        console.log(Router.current().params._id)
        //details.price = Number(details.price);
        Meteor.call("updateClientSettings", Router.current().params._id, details,pIds,notpIds, function(err, response){
            console.log("got callback?");
            console.log(err);
            console.log(response);
            if(err){
                alert(err);
            }
            else{
                if(response.error){
                    alert(response.message);
                } else {
                    alert(response.message)
                }
            }
        });

        if (packageId) {
            Meteor.call("setUserPlan", Router.current().params._id, packageId, function () {
                console.log("arguments in callback");
            });
        }
    },
     'click #checkbox1': function (event, template) {
        //console.log('selectId', this._id);
        // event.preventDefault();

        var status = false;
        if ($('#checkbox1').is(":checked"))        {
            status = true;
        }
        
    },
    'click #checkboxSMS': function (event, template) {		 
        var status = false;
        if ($('#checkboxSMS').is(":checked"))        {
            status = true;
        }        
	},
'change #ratingSelection': function (event,template) { 
  var status=template.$('[name=ratingSelection]').val();
  console.log(status)
  if(status=='base8'){
    //document.getElementById("showDynamicPageLanding").style.display = 'none';
    $('#showDynamicPageLanding').hide();
    $('#showTicketManagement').hide();
    $('#showSentmentAnalysis').hide();
    $('#checkbox3').prop('checked', false);
    $('#checkbox4').prop('checked', false);
    $('#checkbox5').prop('checked', false);
  }if(status=='base6'){
    //document.getElementById("showDynamicPageLanding").style.display = 'none';
    $('#showDynamicPageLanding').show();
    $('#showTicketManagement').show();
    $('#showSentmentAnalysis').show();
    $('#checkbox3').prop('checked', false);
    $('#checkbox4').prop('checked', false);
    $('#checkbox5').prop('checked', false);
  }else if(status=='base10'){
    //document.getElementById("showDynamicPageLanding").style.display = 'none';
    $('#showDynamicPageLanding').show();
    $('#showTicketManagement').show();
    $('#showSentmentAnalysis').show();
    //$("#checkbox3").checked=false;
    $('#checkbox3').prop('checked', false);
    $('#checkbox4').prop('checked', false);
    $('#checkbox5').prop('checked', false);
  }  
 }
});

