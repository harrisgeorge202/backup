/* jshint undef:false, strict:false */

/**
 * Created by baboon-soft on 28/12/15.
 */
Template.paymentView.helpers({
    cardsReady: function () {
        return Router.current().cardsHandle.ready();
    },
    cards: function () {
        return SavedCards.find({sort: {lastUsed: -1}});
    },
    CardRequired: function () {
        console.log(this);
        return this.price;
    },
    savedCards: function () {
        var cards = Template.instance().myAsyncValue.get();
        if (cards.statusCode && cards.statusCode !== 200) {
            alert(cards.message);
        }
        else {
            console.log(cards);
            if (cards.object && cards.object === "list") {
                this.savedCard = function(){
                    return cards.data;
                };
                return true;
            }
            else {
                return false;
            }
        }
    }
});
Template.paymentView.events({
    'submit #payment-fake-form': function (event, template) {

        event.preventDefault();
        var packageIdElement = template.find('#packageIdHidden');
        var stripeIdElement = template.find('#stripeIdHidden');

        var plan = {
            packageId: $(packageIdElement).val(),
            stripeId: $(stripeIdElement).val(),
            token:"notRequiredForUpdate"
        };
        Meteor.call('subscribePlan', plan, function (error, response) {
            console.log(error);
            console.log(response);
            if (error) {
                //alert(error.reason);
                swal({
                    title: "Error!",
                    text: error.reason,
                    type: "warning"
                });
            } else {
                if (response.error) {
                    //alert(response.message);
                    swal({
                        title: "Error!",
                        text: response.message,
                        type: "warning"
                    });
                } else {
                    console.log("Okay");
                    swal({
                        title: "Success!",
                        text: "Payment made, Thank you!",
                        type: "success"
                    });
                    Router.go('platformsList');
                }
            }
        });
    },

    'submit #payment-form': function (event, template) {
        /**
         * Send Card Details
         * Get Card Token
         * Create New Stripe Customer
         *
         */
        event.preventDefault();
        var expMoYr = $('[data-stripe="expMoYr"]').val();
        if (expMoYr.split('/').length !== 2) {
            return "Negative";
        }
        var Card = {
            number: $('[data-stripe="cardNumber"]').val(),
            exp_month: expMoYr.split('/')[0],
            exp_year: '20' + expMoYr.split('/')[1],
            cvc: $('[data-stripe="cvc"]').val(),
            name: $('[data-stripe="name"]').val()
        };

        console.log("Card");
        console.log(Card);

        var packageIdElement = template.find('#packageIdHidden');
        var stripeIdElement = template.find('#stripeIdHidden');

        var plan = {
            packageId: $(packageIdElement).val(),
            stripeId: $(stripeIdElement).val()
        };

        STRIPE.getToken(Card, function (response) {
            console.log("response");
            console.log(response);
            if (response.error) {
                //Bert.alert( response.error.message, "danger" );
                console.log(response.error.message, "danger");
                swal({
                    title: "Error!",
                    text: response.error.message,
                    type: "warning"
                });
            } else {

                plan.token = response.id;
                console.log(plan);
                Meteor.call('subscribePlan', plan, function (error, response) {
                    console.log(error);
                    console.log(response);
                    if (error) {
                        //alert(error.reason);
                        swal({
                            title: "Error!",
                            text: error.reason,
                            type: "warning"
                        });
                    } else {
                        if (response.error) {
                            //alert(response.message);
                            swal({
                                title: "Error!",
                                text: response.message,
                                type: "warning"
                            });
                        } else {
                            console.log("Okay");
                            swal({
                                title: "Success!",
                                text: "Payment made, Thank you!",
                                type: "success"
                            });
                            Router.go('platformsList');
                        }
                    }
                });
            }
        });
    }
});

Template.paymentView.rendered = function () {
    $("#payment-form").validate({
        rules: {
            Number: {
                required: true,
                creditcard: true
            },
            Expiry: {
                required: true
            },
            CVC: {
                required: true,
                minlength: 3
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

Template.paymentView.created = function () {
    console.log("test this");
    var self = this;
    self.myAsyncValue = new ReactiveVar("Waiting for response from server...");
    Meteor.call('getHisCards', function (err, asyncValue) {
        if (err)
            console.log(err);
        else
            self.myAsyncValue.set(asyncValue);
    });
}