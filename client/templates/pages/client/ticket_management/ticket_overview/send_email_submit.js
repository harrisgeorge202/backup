Template.sendemail.onCreated(function () {
    Session.set('EmailcommentSubmitErrors', {});
});
Template.sendemail.helpers({
    errorMessage: function (field) {
        return Session.get('EmailcommentSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('EmailcommentSubmitErrors')[field] ? 'has-error' : '';
    }
});
Template.sendemail.events({
    "click button[type=submit]": function (e, template) {
        console.log('Email submitted');
        e.preventDefault();
        // var name = $('input[name=name]').val();
        var body2 = $('textarea[name=body2]').val();
        var comment = {
            // name: name,
            message: body2,
            ticketId: template.data._id,
            userId: Meteor.userId(),

        };
        console.log(comment);
        var errors = {};


        if (!comment.message) {
            errors.message = "Required";
            return Session.set('EmailcommentSubmitErrors', errors);
        }
        if ($(e.target).prop("id") == "save") {
            console.log('Email comment saved');
            if (confirm("Save comment?\nTicket will not be resolved.")) {
                Meteor.call('ticketemailcommentInsert', comment, 'unresolved', function (error, commentId) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        template.find("form").reset();
                    }
                });




                //// Client: Asynchronously send an email.
                Meteor.call(
                    'sendEmail',
                    'harrisgeorge202@gmail.com',
                    'harris.tblr@gmail.com',
                    'harris.tblr@gmail.com',
                    'Hello from Meteor!',
                    'This is a test of Email.send.',
                );


            }
        }

    },
    'submit form': function (e) {
        e.preventDefault();
    }
});

