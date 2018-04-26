Template.ticketNotification.onCreated(
    function () {
        Session.set('ticketNotificationSubmitError', '');
        Meteor.subscribe('userDetails');
    });
Template.ticketNotification.onRendered(function () {
    var showInput = Meteor.user().settings.ticketNotification;
    if (showInput) {
        $('#input-show').show();
    } else {
        $('#input-show').hide();
    }
});

Template.ticketNotification.events({
    "click #ticket-settings-checkbox": function (event, template) {
        var status = template.$('[name=ticketNotification]').is(":checked");
        if (status) {
            $('#input-show').show();
        } else {
            $('#input-show').hide();
        }
    },
    "submit #ticket-notification-form": function (event, template) {
        event.preventDefault();

        var status = template.$('[name=ticketNotification]').is(":checked");
        var value = $('input[name=wait-input]').val();
        var error;
        if (status === false) {
            var details = {
                $set: {
                    "settings.ticketNotification": template.$('[name=ticketNotification]').is(":checked"),
                    "settings.ticketNotification_value": null
                }
            }
        } else if (!value) {
            error = 'Required';
            return Session.set('ticketNotificationSubmitError', error);
        } else if (isNaN(value)) {
            error = 'Must be a number';
            return Session.set('ticketNotificationSubmitError', error);
        } else if (value.length > 3) {
            error = "Can't be longer than 3";
            return Session.set('ticketNotificationSubmitError', error);
        } else if (status) {
            var details = {
                $set: {
                    "settings.ticketNotification": template.$('[name=ticketNotification]').is(":checked"),
                    "settings.ticketNotification_value": Number(value)
                }
            }
        }

        Meteor.call("updateUserSettings", Meteor.userId(), details, function (err, response) {
            if (err) {
                alert(err);
            } else {
                if (response.error) {
                    alert(response.message);
                } else {
                    alert(response.message)
                }
            }
            $('#ticket-settings').modal('toggle');
        });
    }
});

Template.ticketNotification.helpers({
    ticketNotification: function () {
        if (Meteor.userId()) {
            var user = Meteor.users.find({
                _id: Meteor.userId()
            }).fetch()[0];
            if (user.settings) {
                return user.settings.ticketNotification;
            } else {
                return false;
            }
        } else {
            return false
        }
    },
    currentDelay: function () {
        if (Meteor.userId()) {
            var user = Meteor.users.find({
                _id: Meteor.userId()
            }).fetch()[0];

            if (user.settings) {
                if (user.settings.ticketNotification_value) {
                    return user.settings.ticketNotification_value + ' minutes';
                } else {
                    return 'not configured';
                }
            }
        }
    },
    errorMessage: function () {
        return Session.get('ticketNotificationSubmitError');
    },
    errorClass: function (field) {
        return !!Session.get('ticketNotificationSubmitError') ? 'has-error' : '';
    }
});
