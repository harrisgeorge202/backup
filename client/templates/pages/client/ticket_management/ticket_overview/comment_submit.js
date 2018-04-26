Template.commentSubmit.onCreated(function () {
    Session.set('commentSubmitErrors', {});
});
Template.commentSubmit.helpers({
    errorMessage: function (field) {
        return Session.get('commentSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
    }
});
Template.commentSubmit.events({
    "click button[type=submit]": function (e, template) {
        console.log('comment submitted');
        e.preventDefault();
        var name = $('input[name=name]').val();
        var body = $('textarea[name=body]').val();
        var comment = {
            name: name,
            body: body,
            ticketId: template.data._id,
            userId: Meteor.userId()
        };
        console.log(comment);
        var errors = {};

        if (!comment.name) {
            errors.name = "Required";
            return Session.set('commentSubmitErrors', errors);
        }
        if (!comment.body) {
            errors.body = "Required";
            return Session.set('commentSubmitErrors', errors);
        }
        if ($(e.target).prop("id") == "save") {
            console.log('comment saved');
            if (confirm("Save comment?\nTicket will not be resolved.")) {
                Meteor.call('commentInsert', comment, 'unresolved', function (error, commentId) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        template.find("form").reset();
                    }
                });
            }
        } else if ($(e.target).prop("id") == "resolve") {
            console.log('comment saved, ticket resolved');
            if (confirm("Save comment and resolve ticket?\nTicket will be resolved and further comments will be disabled.")) {
                Meteor.call('commentInsert', comment, 'resolved', function (error, commentId) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        template.find("form").reset();
                    }
                });
            }
        }
    },
    'submit form': function (e) {
        e.preventDefault();
    }
});
