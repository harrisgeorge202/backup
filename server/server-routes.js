/**
 * Created by baboon-soft on 22/12/15.
 */


Router.route('/webhooks/stripe', function () {
    var request = this.request.body;

    switch(request.type){
        case "customer.subscription.updated":
            stripeUpdateSubscription(request.data.object);
            break;
        case "invoice.payment_succeeded":
            stripeCreateInvoice(request.data.object);
            break;
    }

    this.response.statusCode = 200;
    this.response.end('Oh hai Stripe!\n');
}, {where: 'server'});
