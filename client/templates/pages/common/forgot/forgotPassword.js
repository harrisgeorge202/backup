/**
 * Created by baboon-soft on 18/12/15.
 */

/*Accounts.forgotPassword({email: email}, function(err) {
 if (err) {
 if (err.message === 'User not found [403]') {
 console.log("Sorry!.We cannot find the user make sure you have entered the correct emailId.");
 } else {
 console.log("We are sorry but something went wrong. Please try again.");
 }
 } else {
 console.log('Email Sent. Check your mailbox to reset your Password.');
 }
 $('.forgotPasswordForm')[0].reset();
 });*/

Template.forgotPassword.events({
    'submit #forgotPasswordForm': function (e, t) {
        e.preventDefault();

        var forgotPasswordForm = $(e.currentTarget),
            email = forgotPasswordForm.find('#forgotPasswordEmail').val().toLowerCase();
        email = email.trim();

        console.log('fired');

        if (!!email) {
            $('[type="submit"]').attr('disabled',"true");
            Accounts.forgotPassword({email: email}, function (err) {
                if (err) {
                    $('.alert').addClass('alert-danger');
                    $('.alert').removeClass('alert-success');
                    if (err.message === 'User not found [403]') {
                        console.log('This email does not exist.');
                        $('.alert').text('This email does not exist!');
                    } else {
                        console.log('We are sorry but something went wrong.');
                        $('.alert').text('We are sorry but something went wrong!');
                    }
                    $('[type="submit"]').removeAttr('disabled');
                } else {
                    $('.alert').removeClass('alert-danger');
                    $('.alert').addClass('alert-success');
                    $('.alert').text('Email Sent. Check your mailbox.');
                    console.log('Email Sent. Check your mailbox.');
                }
            });

        }
        return false;
    }
});

if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
}

Template.resetPassword.helpers({
    resetPassword: function () {
        return Session.get('resetPassword');
    }
});

Template.resetPassword.events({
    'submit #resetPasswordForm': function (e, t) {
        e.preventDefault();

        var resetPasswordForm = $(e.currentTarget),
            password = resetPasswordForm.find('#resetPasswordPassword').val(),
            passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();

        if (password && password == passwordConfirm) {
            Accounts.resetPassword(Session.get('resetPassword'), password, function (err, response) {
                console.log("err, response");
                console.log(err);
                console.log(response);
                if (err) {
                    //$('.alert').addClass('alert-danger');
                    //$('.alert').removeClass('alert-success');
                    console.log(err);
                    $('#forgot-alert').html('<div class="alert alert-danger no-margins">We are sorry but something went wrong!</div>');
                } else {
                    console.log('Your password has been changed. Welcome back!');
                    Session.set('resetPassword', null);
                }
            });
        }
        return false;
    }
});

Template.forgotPassword.rendered = function(){
    $("#forgotPasswordForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            email: {
                required: "Email is required",
                email: "Invalid email"
            }
        }
    });
};

Template.resetPassword.rendered = function(){
    $("#resetPasswordForm").validate({
        rules: {
            password: {
                required: true,
                minlength: 6
            },
            confirm: {
                required: true,
                equalTo: "#resetPasswordPassword"
            }
        }
    });
};

