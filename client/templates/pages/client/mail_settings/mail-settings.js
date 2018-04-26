/**
 * Created by baboon-soft on 31/12/15.
 */
/*var options = {
 keepHistory: 1000 * 60 * 5,
 localSearch: true
 };
 var fields = ['name', 'stripeId'];

 PackageSearch = new SearchSource('packages', fields, options);*/
Template.ClientMailSettings.onRendered(function () {
    var isThereEmailNotification = Meteor.user().settings.emailNotification;
    var isThereSmsNotification = Meteor.user().settings.smsNotification;


    if (isThereEmailNotification || isThereSmsNotification) {
        $('#show').show();
    }
    var len = Meteor.user().settings.notification_value.length;
    var data = Meteor.user().settings.notification_value;
    var scale = Meteor.user().settings.scaleType;
    var value;


    if (!data.length) {
        console.log("empty array ")
        if (scale == 'base10') {
            data.push(6);
            console.log("empty array1  " + data)
        } else {
            data.push(-1);
            console.log("empty array2  " + data)
        }
    }
    // console.log(data)
    $('#client-add-mailNotification-form').find(':checkbox[name^="notification_value"]').each(function () {
        $(this).prop("checked", ($.inArray(parseInt($(this).val()), data) != -1));
    });
});
Template.ClientMailSettings.helpers({


    /* platformsExists: function () {
         return Platforms.find().fetch().length;
     },
     platforms: function () {
         return Platforms.find();
     },
     sessions:function(){
         return Sessions.find();
     },*/

    scaleType: function (scaleType) {
        var scale = Meteor.user().settings.scaleType;
        if (scale == scaleType) {
            return true;
        }
    },
    hotelid: function () {

        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch();
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })
        console.log(sessionids)
        var data = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Maestro' })
        console.log(Sessions.findOne({ 'platformId': data._id }).hotelId)
        //return Sessions.findOne({'platformId':data._id}).hotelId
        return Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).hotelId
    },
    hotelpass: function () {

        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch();
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })
        console.log(sessionids)
        var data = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Maestro' })
        console.log(Sessions.findOne({ 'platformId': data._id }).hotelPass)
        //return Sessions.findOne({'platformId':data._id}).hotelPass
        return Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).hotelPass
    },


    actionCheckin: function () {

        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch();
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })
        console.log(sessionids)
        var data = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Maestro' })
        console.log(2111111111111111111111)
        console.log(Sessions.findOne({ 'platformId': data._id }).hotelAction)
        if (Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).hotelAction) {
            var status = Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).hotelAction.toUpperCase()
            if (status == 'CHECKIN') {
                return true;
            } else {
                return false;
            }
        }
    },

    typeLong: function () {

        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch();
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })
        console.log(sessionids)
        var data = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Crane' })
        console.log(2111111111111111111111)
        console.log(Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).type)
        if (Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).type) {
            var status = Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).type;
            if (status == 'long') {
                return true;
            } else {
                return false;
            }
        }
    },
    actionMaestro: function () {

        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch();
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })
        console.log(sessionids)
        var data = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Maestro' })
        console.log(Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).hotelAction)
        if (Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).hotelAction) {
            return Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).hotelAction;
        }
    },
    typeCrane: function () {

        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch();
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })
        console.log(sessionids)
        var data = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Crane' })
        console.log(Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).type)
        if (Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).type) {
            return Sessions.findOne({ 'ownerId': Meteor.userId(), 'platformId': data._id }).type;
        }
    },

    findMaestro: function () {
        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch();
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })
        console.log(sessionids)
        var data = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Maestro' })
        if (data) {
            return data
        } else {
            return false
        }

    },
    findCrane: function () {
        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch();
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })
        console.log(sessionids)
        var data = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Crane' })
        if (data) {
            return data
        } else {
            return false
        }

    },
    emailNotification: function () {
        if (Meteor.userId()) {
            var user = Meteor.users.find({ _id: Meteor.userId() }).fetch()[0];
            // console.log("user")
            console.log(user)
            if (user.settings) {
                return user.settings.emailNotification;
            } else {
                return false;
            }
        } else {
            return false
        }
    },




    expiry: function () {
        if (Meteor.userId()) {
            var user = Meteor.users.find({ _id: Meteor.userId() }).fetch()[0];
            // console.log("user")
            console.log(user)
            if (user.settings) {
                return user.settings.expiry;
            } else {
                return false;
            }
        } else {
            return false
        }
    },


    smsNotification: function () {
        if (Meteor.userId()) {
            var user = Meteor.users.find({ _id: Meteor.userId() }).fetch()[0];
            // console.log("user")
            console.log(user)
            if (user.settings) {
                return user.settings.smsNotification;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    availableSMS: function () {
        if (Meteor.userId()) {
            var user = Meteor.users.find({ _id: Meteor.userId() }).fetch()[0];
            // console.log("user")
            console.log(user)
            if (user.settings) {
                return user.settings.availableSMS;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
});

Template.ClientMailSettings.events({
    "submit #client-add-mailNotification-form": function (event, template) {
        event.preventDefault();

        var e1 = 'done';//error msg for Maestro

        var notificationValue = $('input[name="notification_value[]"]:checked').map(function () {
            return parseInt(this.value);
        }).get();
        console.log(notificationValue)

        //var notificationValue=template.$('[name=notification_value]:checked').val();
        var sessionData = Sessions.find({ 'ownerId': Meteor.userId() }).fetch()
        var sessionids = sessionData.map(function (data) {
            return data.platformId
        })

        //Maestro 
        var maestro = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Maestro' })
        //Crane
        var crane = Platforms.findOne({ '_id': { '$in': sessionids }, 'system_integration_name': 'Crane' })
        if (maestro) {
            var maestroDetails = {
                hotelId: template.find("#session-hotelId").value,
                hotelPass: template.find("#session-hotelPass").value,
                Action: (template.$('[name=actionSelection]').val())
            }
            if (Sessions.find({ 'ownerId': { $ne: Meteor.userId() }, 'platformId': maestro._id, $or: [{ hotelId: maestroDetails.hotelId }, { hotelPass: maestroDetails.hotelPass }] }).fetch().length > 1) {
                e1 = "Hotel Already Exist";
            } else {
                if (Sessions.find({ 'ownerId': { $ne: Meteor.userId() }, 'platformId': maestro._id, 'hotelAction': maestroDetails.Action, $or: [{ hotelId: maestroDetails.hotelId }, { hotelPass: maestroDetails.hotelPass }] }).fetch().length > 0) {
                    e1 = "Action Already Exist";
                } else {
                    e1 = 'done';
                }

            }
        }
        if (crane) {
            var craneDetails = {
                type: template.$('[name=typeSelection]').val(),
            }
        }
        console.log(e1)
        if (e1 == 'done') {
            if (crane) {
                Meteor.call("updatecraneDetails", crane._id, craneDetails, function (err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Crane Details Inserted into Sessions")
                    }
                });
            }
            if (maestro) {
                Meteor.call("updateHotelDetails", maestro._id, maestroDetails, function (err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Hotel Details Inserted into Sessions")
                    }
                });
            }
            if (notificationValue) {
                var details = {
                    $set: {
                        "settings.emailNotification": template.$('[name=emailNotification]').is(":checked"),
                        "settings.smsNotification": template.$('[name=smsNotification]').is(":checked"),

                        "settings.expiry": template.find('#expiry').value,

                        "settings.notification_value": notificationValue

                    }
                };
            } else {
                var details = {
                    $set: {

                        "settings.expiry": template.find('#expiry').value,
                        "settings.emailNotification": template.$('[name=emailNotification]').is(":checked"),
                        "settings.smsNotification": template.$('[name=smsNotification]').is(":checked"),

                    }
                }
            }
            console.log(details)
            Meteor.call("updateUserSettings", Meteor.userId(), details, function (err, response) {
                if (err) {
                    alert(err);
                }
                else {
                    if (response.error) {
                        alert(response.message);
                    } else {
                        alert(response.message)
                    }
                }
            });

        } else {
            alert(e1)
        }
    },

    'click #checkbox1': function (event, template) {
        //console.log('selectId', this._id);
        // event.preventDefault();
        var smsStatus = template.$('[name=smsNotification]').is(":checked");
        var emailStatus = template.$('[name=emailNotification]').is(":checked");

        var status = smsStatus || emailStatus;
        var data;
        if (Meteor.user().settings.notification_value) {
            data = Meteor.user().settings.notification_value;
        }

        console.log(status)
        if (status) {
            $('#show').show();
        } else {
            $('#show').hide();
        }
        var scale = Meteor.user().settings.scaleType;
        // if(scale=='base10'){
        //     data.push(6);
        //      console.log("empty array1  "+data)
        // }else{
        //     data.push(-1);
        //     console.log("empty array2  "+data)
        // }
        // console.log(data)
        $('#client-add-mailNotification-form').find(':checkbox[name^="notification_value"]').each(function () {
            $(this).prop("checked", ($.inArray(parseInt($(this).val()), data) != -1));
        });
        var status = false;
        if ($('#emailCheckbox').is(":checked") || $('#smsCheckbox').is(":checked")) {
            status = true;
        }

    },
    'click #smsCheckbox': function (event, template) {
        //console.log('selectId', this._id);
        // event.preventDefault();

        var smsStatus = template.$('[name=smsNotification]').is(":checked");
        var emailStatus = template.$('[name=emailNotification]').is(":checked");

        var status = smsStatus || emailStatus;
        var data = Meteor.user().settings.notification_value;

        if (status) {
            $('#show').show();
        } else {
            $('#show').hide();
        }
        var scale = Meteor.user().settings.scaleType;
		/*
        if(scale=='base10'){
            data.push(6);
             console.log("empty array1  "+data)
        }else{
            data.push(-1);
            console.log("empty array2  "+data)
        }
		*/
        // console.log(data)
        $('#client-add-mailNotification-form').find(':checkbox[name^="notification_value"]').each(function () {
            $(this).prop("checked", ($.inArray(parseInt($(this).val()), data) != -1));
        });

        var status = false;
        if ($('#emailCheckbox').is(":checked") || $('#smsCheckbox').is(":checked")) {
            status = true;
        }

    },





    'click #expirycheckbox1': function (event, template) {
        //console.log('selectId', this._id);
        // event.preventDefault();
        var smsStatus = template.$('[name=smsNotification]').is(":checked");
        var emailStatus = template.$('[name=emailNotification]').is(":checked");


        var expiryStatus = template.$('[name=expiry]').value;



        var status = smsStatus || emailStatus || expiryStatus;
        var data = Meteor.user().settings.notification_value;


        // console.log(status)
        if (status) {
            $('#show').show();
        } else {
            $('#show').hide();
        }
        var scale = Meteor.user().settings.scaleType;

        $('#client-add-mailNotification-form').find(':checkbox[name^="notification_value"]').each(function () {
            $(this).prop("checked", ($.inArray(parseInt($(this).val()), data) != -1));
        });
        var status = false;
        if ($('#emailCheckbox').is(":checked") || $('#smsCheckbox').is(":checked") || $('#expirycheckbox1').value) {
            status = true;
        }

    }





});

