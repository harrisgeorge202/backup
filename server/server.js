

/**
 * Created by baboon-soft on 18/12/15.
 */
/* jshint -W034, -W024, -W117, strict:false */

//var secret = Meteor.settings.private.stripe.liveSecretKey;
//var Stripe = StripeAPI(secret);
var Future = Npm.require('fibers/future');
// var NaturalLanguageUnderstandingV1 = Npm.require('watson-developer-cloud/natural-language-understanding/v1.js');
// var natural_language_understanding = new NaturalLanguageUnderstandingV1({
//   'username': Meteor.settings.private.watson.username,
//   'password': Meteor.settings.private.watson.password,
//   'version_date': Meteor.settings.private.watson.version_date
// });
//var stripe = Npm.require("stripe");


Meteor.methods({
    sendEmail: function (to, from, replyTo, subject, text) {
        // Make sure that all arguments are strings.
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running, without
        // waiting for the email sending to complete.
        this.unblock();


        Email.send({
            to: to,
            from: from,
            replyTo: replyTo,
            subject: subject,
            text: text
        });
        console.log("CCCCCCCCCCccccccccccc")

    },
    watsonAnalyze: function (parameters) {
        // this.unblock();
        // // return new Promise((resolve, reject) => {
        //   natural_language_understanding.analyze(parameters, function(error, result) {
        //     if (error) {
        //     //   reject(error);
        //       throw new Meteor.Error(error);
        //     } else {
        //     //   resolve(result);
        //         return result
        //     }
        //   });
        // })
        throw new Meteor.Error('abc');
    },
    checkRole: function (email) {
        var data = Meteor.users.findOne({ "emails.address": email });
        if (data) {
            if (data.roles[0] === 'user') {
                return "user";
            } else {
                return "admin";
            }
        } else {
            return "nonuser";
        }
    },
    // platform Management
    createPlatform: function (details) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log(details);
        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }
        if (details.name && details.description) {
            details.status = "active";
            Platforms.insert(details);
        }
    },
    updatePlatform: function (platformId, details) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log(platformId, details);
        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }
        if (details.name && details.description) {
            console.log("Updating...");
            Platforms.update(platformId, {
                $set: details
            });
        }
    },
    deletePlatform: function (platformId) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log(platformId);
        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }
        Platforms.update(platformId, { $set: { status: "deleted" } });
        Sessions.update({ "platformId": platformId }, { $set: { status: "deleted" } });
    },
    // package management
    createPackage: function (details) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log(details);
        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }
        if (details.name && details.monthlyEmailLimit) {
            details.price = Math.abs(details.price);
            details.status = true;
            details.stripeId = Packages.uniquePlanName();

            console.log("sending to stripe");
            console.log(details);

            var stripeNewPackage = new Future();
            var packageId = Packages.insert(details);
            console.log(packageId);
            stripeNewPackage.return({
                error: false,
                message: "Package created succesfully!",
                response: { date: true, packageId: packageId }
            });

            //TODO: Hide stripe plan creation step, make sure the planIds are sync before uncommenting this feature
            /*
                        var stripeNewPackage = new Future();
                        Meteor.call('createPlanOnStrip', details.stripeId, details.price, details.name, function (error, response) {
                            console.log("createPackage -->");
                            console.log("error");
                            console.log(error);
                            console.log("response");
                            console.log(response);
                            //{error:false,message:"",response:{date:true}}
                            if (error) {
                                console.log("error in createPlanOnStrip");
                                console.log(error);
                                stripeNewPackage.return({
                                    error: true,
                                    message: "Unknown error in createPlanOnStrip",
                                    response: {date: false}
                                });
                            } else {
                                //you got a plan object
                                if (response.currency) {
                                    var packageId = Packages.insert(details);
                                    console.log(packageId);
                                    stripeNewPackage.return({
                                        error: false,
                                        message: "",
                                        response: {date: true, packageId: packageId}
                                    });
                                }
                                else {
                                    stripeNewPackage.return({error: true, message: response.raw.message, response: {date: false}});
                                }
                            }
                        }); */
            return stripeNewPackage.wait();

        }
    },
    updatecraneDetails: function (platformId, craneDetails) {
        console.log("in update crane function");
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        try {
            return Sessions.update({
                "platformId": platformId,
                "ownerId": Meteor.userId()
            }, {
                    $set: {
                        "type": craneDetails.type
                    }
                });

        } catch (e) {
            console.log(e);
        }
    },
    updateHotelDetails: function (platformId, maestroDetails) {
        console.log("in update hotelId function");
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        try {
            return Sessions.update({
                "platformId": platformId,
                "ownerId": Meteor.userId()
            },
                { $set: { "hotelId": maestroDetails.hotelId, "hotelPass": maestroDetails.hotelPass, "hotelAction": maestroDetails.Action } }
            );

        } catch (e) {
            console.log(e);
        }

    },

    updatePackage: function (packageId, details) {
        console.log("details");
        console.log(details);
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log(packageId, details);
        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }

        if (details.monthlyEmailLimit) {
            var packageDoc = Packages.findOne(packageId);
            if (packageDoc && packageDoc._id) {
                details.stripeId = packageDoc.stripeId;
                console.log("Updating...");
                if (details.name) {
                    var stripeNewPackage = new Future();

                    console.log("Packages.update(" + packageId + ", {$set: details})");
                    var result = Packages.update(packageId, {
                        $set: details
                    });
                    console.log(result);
                    stripeNewPackage.return({
                        error: false,
                        message: "Package created succesfully!",
                        response: {
                            date: true,
                            packageId: packageId
                        }
                    });

                    /* Meteor.call('updatePlanOnStrip', details.stripeId, details.name, function (error, response) {
                         console.log("error");
                         console.log(error);
                         console.log("response");
                         console.log(response);

                         if (error) {
                             console.log("error in updatePlanOnStrip");
                             console.log(error);
                             stripeNewPackage.return({
                                 error: true,
                                 message: "Unknown error in updatePlanOnStrip",
                                 response: {date: false}
                             });
                         } else {
                             //you got a plan object
                             if (response.currency) {

                                 console.log("Packages.update(" + packageId + ", {$set: details})");
                                 var result = Packages.update(packageId, {$set: details});
                                 console.log(result);
                                 stripeNewPackage.return({
                                     error: false,
                                     message: "",
                                     response: {date: true, packageId: packageId}
                                 });
                             }
                             else {
                                 stripeNewPackage.return({
                                     error: true,
                                     message: response.raw.message,
                                     response: {date: false}
                                 });
                             }
                         }
                     });*/
                    return stripeNewPackage.wait();
                } else {
                    var result = Packages.update(packageId, { $set: details });
                    return { error: false, message: "package updated", response: { date: true, packageId: packageId } };
                }
            } else {
                console.log("package not found");
                return "package not found";
            }

        } else {
            console.log("details required");
            return "details required";
        }
    },
    deletePackage: function (packageId) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log(packageId);
        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }
        var packageDoc = Packages.findOne(packageId);
        if (packageDoc && packageDoc._id) {
            var stripeNewPackage = new Future();
            /*Meteor.call('deletePlanOnStrip', packageDoc.stripeId, function (error, response) {
                console.log("error");
                console.log(error);
                console.log("response");
                console.log(response);
                if (error) {
                    console.log("error in updatePlanOnStrip");
                    console.log(error);
                    stripeNewPackage.return(error);
                } else {
                    console.log("Packages.update(" + packageId + ", {$set: {status: 'deleted'}})");
                    var result = Packages.update(packageId, {$set: {status: "deleted"}});
                    console.log(result);
                    stripeNewPackage.return(packageId);
                }
            });*/
            return stripeNewPackage.wait();
        } else {
            return "package not found";
        }
    },
    // User Management
    changeUserStatus: function (userId, status) {

        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }

        Meteor.users.update(userId, { $set: { "status": status } });
    },
    // turn on/ off email sending
    changeMailStreamStatus: function (sessionId, status) {

        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Sessions.update({
            ownerId: Meteor.userId(),
            "_id": sessionId
        }, {
                $set: { "email_stream": status }
            });
    },
    // turn on/ off comment box
    changeCommentBoxStatus: function (sessionId, status) {

        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Sessions.update({
            ownerId: Meteor.userId(),
            "_id": sessionId
        }, {
                $set: { "commentBox": status }
            });
    },

    //Question Management
    addQuestion: function (platformId, text) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        if (text && platformId) {
            Questions.insert({
                text: text.substring(0, 70),
                "platformId": platformId,
                "userId": Meteor.userId(),
                "createdOn": new Date(),
                "status": "active"
            });
        }
    },
    updateQuestion: function (questionId, text) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Questions.update(questionId, {
            $set: {
                "text": text.substring(0, 70),
                "status": "active"
            }
        });
    },
    deleteQuestion: function (questionId) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Questions.update(questionId, {
            $set: {
                status: "deleted"
            }
        });
    },
    finishQuestions: function (questionsArray) {


        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        if (!questionsArray.length) {
            console.log("skipped deleting Questions");
            return;
        }
        Questions.update({
            "_id": {
                $in: questionsArray
            }
        }, {
                $set: {
                    "status": "deleted"
                }
            }, {
                upsert: false,
                multi: true
            });
    },
    //payment Related
    subscribePlan: function (plan) {

        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        console.log("In subscribePlan");
        check(plan, {
            packageId: String,
            stripeId: String,
            token: String
        });

        if (Meteor.user() && Meteor.user().emails[0].address) {

            var packageChosen = Packages.findOne({
                _id: plan.packageId
            });

            if (packageChosen.stripeId !== plan.stripeId) {
                throw new Meteor.Error("plIng!");
            }

            var newCustomer = new Future();

            if (Meteor.user().stripeCustomerId) {
                var customerId = Meteor.user().stripeCustomerId,
                    stripePlanName = plan.stripeId;

                Meteor.call('stripeUpdateSubscription', customerId, stripePlanName, function (error, response) {
                    if (error) {
                        newCustomer.return(error);
                    } else {
                        if (response.error) {
                            newCustomer.return(response);
                        } else {

                            var now = new Date();

                            Meteor.users.update({
                                _id: Meteor.userId()
                            }, {
                                    $set: {
                                        "profile.packageId": plan.packageId,
                                        "packageChosen": stripePlanName,
                                        "packageId": plan.packageId,
                                        "stripeCardToken": plan.token,
                                        "packageEmailLimit": packageChosen.monthlyEmailLimit,
                                        "monthlyEmailLimit": packageChosen.monthlyEmailLimit,
                                        "lastUpdatedMonth": now.getMonth(),
                                        "packageSelectedDate": now.getDate(),
                                        "packageSelectedMonth": now.getMonth()
                                    }
                                });
                            newCustomer.return(response);
                        }
                    }
                });

            } else {
                Meteor.call('stripeCreateCustomer', plan.token, Meteor.user().emails[0].address, function (error, stripeCustomer) {
                    if (error) {
                        console.log("error in stripeCreateCustomer");
                        console.log(error);
                    } else {
                        if (stripeCustomer.email === Meteor.user().emails[0].address) {
                            var customerId = stripeCustomer.id,
                                stripePlanName = plan.stripeId;

                            Meteor.call('stripeCreateSubscription', customerId, stripePlanName, function (error, response) {
                                if (error) {
                                    newCustomer.return(error);
                                } else {
                                    if (response.error) {
                                        newCustomer.return(response);
                                    } else {

                                        var now = new Date();

                                        Meteor.users.update({
                                            _id: Meteor.userId()
                                        }, {
                                                $set: {
                                                    "profile.packageId": plan.packageId,
                                                    "stripeCustomerId": customerId,
                                                    "packageChosen": stripePlanName,
                                                    "packageId": plan.packageId,
                                                    "stripeCardToken": plan.token,
                                                    "packageEmailLimit": packageChosen.monthlyEmailLimit,
                                                    "monthlyEmailLimit": packageChosen.monthlyEmailLimit,
                                                    "lastUpdatedMonth": now.getMonth(),
                                                    "packageSelectedDate": now.getDate(),
                                                    "packageSelectedMonth": now.getMonth()
                                                }
                                            });
                                        newCustomer.return(response);
                                    }
                                }
                            });
                        } else {
                            newCustomer.return(stripeCustomer);
                        }
                    }
                });
            }


            return newCustomer.wait();
        } else {
            return "User not logged in";
        }

    },
    stripeCreateCustomer: function (token, email) {
        // Note: we'd check() both of our arguments here, but I've stripped this out for the sake of brevity.

        var stripeCustomer = new Future();

        Stripe.customers.create({
            source: token,
            email: email
        }, function (error, customer) {
            if (error) {
                error.error = true;
                stripeCustomer.return(error);
            } else {
                stripeCustomer.return(customer);
            }
        });

        return stripeCustomer.wait();
    },
    stripeCreateSubscription: function (customer, plan) {
        // Again, we'd do a check() here. Don't skip it!

        var stripeSubscription = new Future();

        Stripe.customers.createSubscription(customer, {
            plan: plan
        }, function (error, subscription) {
            console.log("error");
            console.log(error);
            console.log("subscription");
            console.log(subscription);
            if (error) {
                error.error = true;
                stripeSubscription.return(error);
            } else {
                stripeSubscription.return(subscription);
            }
        });

        return stripeSubscription.wait();
    },
    stripeUpdateSubscription: function (customerId, plan) {
        check(plan, String);
        check(customerId, String);

        /*stripe.customers.createSource(
         "cus_7hobhmnnl5dkxF",
         {source: "tok_17KiVkARGqlcoHblHYoYBz7h"},
         function(err, card) {
         // asynchronously called
         }
         );*/

        var stripeUpdateSubscription = new Future();

        /*        var user    = Meteor.userId();
         var getUser = Meteor.users.findOne({"_id": user}, {fields: {"customerId": 1}});*/

        Stripe.customers.updateSubscription(customerId, {
            plan: plan
        }, function (error, subscription) {
            console.log("error");
            console.log(error);
            console.log("subscription");
            console.log(subscription);
            if (error) {
                error.error = true;
                stripeUpdateSubscription.return(error);
            } else {
                /* Fiber(function(){
                 var update = {
                 auth: SERVER_AUTH_TOKEN,
                 user: user,
                 plan: plan,
                 status: subscription.status,
                 date: subscription.current_period_end
                 }
                 Meteor.call('updateUserPlan', update, function(error, response){
                 if (error){
                 stripeUpdateSubscription.return(error);
                 } else {
                 stripeUpdateSubscription.return(response);
                 }
                 });
                 }).run();*/
                stripeUpdateSubscription.return(subscription);
            }
        });

        return stripeUpdateSubscription.wait();
    },
    stripeUpdateCard: function (updates) {
        Meteor.call('stripeRetrieveCustomer', getUser.customerId, function (error, response) {
            if (error) {
                stripeUpdateCard.return(error);
            } else {
                var card = response.cards.data[0].id;
                Stripe.customers.updateCard(getUser.customerId, card, updates, function (error, customer) {
                    if (error) {
                        stripeUpdateCard.return(error);
                    } else {
                        stripeUpdateCard.return(customer);
                    }
                });
            }
        });
    },
    createPlanOnStrip: function (id, amount, name) {

        check(id, String);
        check(amount, Number);
        check(name, String);

        amount *= 100;

        var PlanOnStrip = new Future();

        Stripe.plans.create({
            amount: amount,
            interval: "month",
            name: name,
            currency: "usd",
            id: id
        }, function (err, plan) {
            // asynchronously called
            if (err) {
                PlanOnStrip.return(err);
            } else {
                PlanOnStrip.return(plan);
            }
        });


        /*HTTP.call('POST', 'https://api.stripe.com/v1/plans', {
         "content": "id=" + id + "&amount=" + amount + "&interval=month&name=" + name + "&currency=usd",
         auth: "sk_test_vUaPazrpMaZAk9PSZoehtWLg:",
         headers: {"content-type": "application/x-www-form-urlencoded"}
         }, function (error, response) {
         // Handle the error or response here.
         console.log("createPlanOnStrip - error & response");
         console.log(error);
         console.log(response);

         if (error && response.statusCode !== 200) {
         response.error = true;
         response.errorMessage = response.data && response.data.error && response.data.error.message;
         }

         PlanOnStrip.return(response);
         });*/

        return PlanOnStrip.wait();
    },
    updatePlanOnStrip: function (id, name) {

        check(id, String);
        check(name, String);

        var PlanOnStrip = new Future();

        Stripe.plans.update(id, {
            name: name
        }, function (err, plan) {
            console.log(" Stripe.plans.create");
            console.log(err);
            console.log(plan);
            // asynchronously called
            if (err) {
                PlanOnStrip.return(err);
            } else {
                PlanOnStrip.return(plan);
            }
        });

        return PlanOnStrip.wait();
    },
    deletePlanOnStrip: function (id) {

        check(id, String);

        var PlanOnStrip = new Future();
        //https://api.stripe.com/v1/plans/{PLAN_ID}
        HTTP.call('DELETE', 'https://api.stripe.com/v1/plans/' + id, {
            //"content": "name=" + name,
            auth: "sk_live_q2BymxD00vR7rt1KTvcHDdjr:",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        }, function (error, response) {
            // Handle the error or response here.
            console.log(error);
            console.log(response);
            PlanOnStrip.return(response);
        });

        return PlanOnStrip.wait();
    },






    addMultiEmail: function (settings) {

        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        //console.log(Meteor.settings.public.delay);
        //console.log("arguments");
        //console.log(arguments);

        Meteor.users.update({
            _id: Meteor.userId()
        }, {
                $set: {
                    //"profile.delay": settings.delay,
                    "profile.inEmail": settings.inEmail,
                    "profile.inSms": settings.inSms,
                    "profile.name": settings.name,
                    "profile.phone": settings.phone,
                    "profile.website": settings.website,
                    "profile.storeName": settings.storeName
                }
            });
    },







    // profile settings
    updateSettings: function (settings) {

        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Meteor.users.update({
            _id: Meteor.userId()
        }, {
                $set: {
                    //"profile.delay": settings.delay,
                    "profile.emails": settings.emails,
                    "profile.smses": settings.smses,
                    "profile.name": settings.name,
                    "profile.phone": settings.phone,
                    "profile.website": settings.website,
                    "profile.storeName": settings.storeName
                }
            });
    },
    // Auth session for API
    createKeys: function (platformId) {
        var unique = (String(Math.random())).split('.')[1] + Date.now();
        Sessions.insert({
            "secret": Random.id(),
            "key": Random.secret(),
            "token": [{
                "hashedToken": unique //bypass unique index for the first time
            }],
            "status": true,
            "platformId": platformId,
            "ownerId": Meteor.userId(),
            "platform_delay": "no_delay",
            "email_stream": true
        });

        // update platform name if necessary
    },




    reset: function (platformId, fieldname) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        try {
            var update_query = {
                "$set": {}
            };
            update_query["$set"][fieldname] = null;
            return Sessions.update({
                "_id": platformId,
                "ownerId": Meteor.userId()
            }, update_query);

        } catch (e) {
            console.log(e);
            // throw new Meteor.Error(e);
        }

    },



    updateSession: function (platformId, obj) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        try {
            return Sessions.update({
                "_id": platformId,
                "ownerId": Meteor.userId()
            }, {
                    $set: {
                        defaultComment: obj.defaultComment,
                        comment1: obj.comment1,
                        comment2: obj.comment2,
                        comment3: obj.comment3,
                        base6_comment1: obj.base6_comment1,
                        base6_comment2: obj.base6_comment2,
                        platform_message: obj.platform_message,
                        platform_delay: obj.platform_delay,
                        header_font_color: obj.header_font_color,
                        top_color: obj.top_color,
                        bottom_color: obj.bottom_color,
                        senderName: obj.senderName,
                        logo: obj.logo,
                        surveyTopBanner: obj.surveyTopBanner,
                        thankyouTopBanner: obj.thankyouTopBanner,
                        surveyBottomBanner: obj.surveyBottomBanner,
                        thankyouBottomBanner: obj.thankyouBottomBanner,
                        email_subject: obj.email_subject,
                        rating_color: obj.rating_color
                    }
                });

        } catch (e) {
            console.log(e);
            // throw new Meteor.Error(e);
        }
    },
    getHisCards: function () {

        if (Meteor.user() && Meteor.user().emails[0].address) {

            if (Meteor.user().stripeCustomerId) {
                var customerId = Meteor.user().stripeCustomerId;

                var CardsOnStrip = new Future();

                Stripe.customers.listCards(customerId,
                    function (err, cards) {
                        // asynchronously called
                        if (err) {
                            CardsOnStrip.return(err);
                        } else {
                            CardsOnStrip.return(cards);
                        }
                    });

                return CardsOnStrip.wait();
            } else {
                return ["no cards for this non-stripe user"];
            }

        } else {
            return ["no cards for this non-user"];
        }
    },








    setUserPlan: function (userId, packageId) {

        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }

        if (userId && packageId) {

            var packageData = Packages.findOne(packageId);

            var user = Meteor.users.findOne({
                _id: userId
            });

            /*if (user && user.stripeCustomerId) {
                var customerId = user.stripeCustomerId,
                    stripePlanName = packageData.stripeId;

                Meteor.call('stripeUpdateSubscription', customerId, stripePlanName, function (error, response) {
                    if (error) {
                        console.log("error in stripeUpdateSubscription");
                        console.log(error);
                        return {status: false, message: "error in stripeUpdateSubscription"};
                    } else {
                        if (response.error) {
                            console.log("response.error");
                            console.log(response.error);
                            return {status: false, message: "error in stripeUpdateSubscription"};
                        }
                        else {*/
            var now = new Date();

            Meteor.users.update({
                _id: userId
            }, {
                    $set: {
                        "stripeCustomerId": 11111111111111111111,
                        "stripeCardToken": 11111111111111111111,
                        "profile.packageId": packageData._id,
                        "packageChosen": packageData.stripeId,
                        "packageId": packageData._id,
                        "packageEmailLimit": packageData.monthlyEmailLimit,
                        "monthlyEmailLimit": packageData.monthlyEmailLimit,
                        "lastUpdatedMonth": now.getMonth(),
                        "packageSelectedDate": now.getDate(),
                        "packageSelectedMonth": now.getMonth()
                    }
                });

            return {
                status: true,
                message: "package changed to " + packageData.name
            };
            /* }
                    }
                });*/
            /* }
             else {
                 return {status: false, message: "Payment not possible, package changing failed"};
             }*/


        }
    },









    updateUserPlan: function (userId, packageId) {

        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        if (Meteor.user().roles && Meteor.user().roles[0] !== 'admin') {
            throw new Meteor.Error("not-authorized");
        }

        if (userId && packageId) {

            var packageData = Packages.findOne(packageId);

            var user = Meteor.users.findOne({
                _id: userId
            });

            if (user && user.stripeCustomerId) {
                var customerId = user.stripeCustomerId,
                    stripePlanName = packageData.stripeId;

                var now = new Date();

                Meteor.users.update({
                    _id: userId
                }, {
                        $set: {
                            "profile.packageId": packageData._id,
                            "packageChosen": packageData.stripeId,
                            "packageId": packageData._id,
                            "packageEmailLimit": packageData.monthlyEmailLimit,
                            "monthlyEmailLimit": packageData.monthlyEmailLimit,
                            "lastUpdatedMonth": now.getMonth(),
                            "packageSelectedDate": now.getDate(),
                            "packageSelectedMonth": now.getMonth()
                        }
                    });

                return {
                    status: true,
                    message: "package changed to " + packageData.name
                };



                /*   Meteor.call('stripeUpdateSubscription', customerId, stripePlanName, function (error, response) {
                       if (error) {
                           console.log("error in stripeUpdateSubscription");
                           console.log(error);
                           return {status: false, message: "error in stripeUpdateSubscription"};
                       } else {
                           if (response.error) {
                               console.log("response.error");
                               console.log(response.error);
                               return {status: false, message: "error in stripeUpdateSubscription"};
                           }
                           else {
                               var now = new Date();

                               Meteor.users.update({_id: userId}, {
                                   $set: {
                                       "profile.packageId": packageData._id,
                                       "packageChosen": packageData.stripeId,
                                       "packageId": packageData._id,
                                       "packageEmailLimit": packageData.monthlyEmailLimit,
                                       "monthlyEmailLimit": packageData.monthlyEmailLimit,
                                       "lastUpdatedMonth": now.getMonth(),
                                       "packageSelectedDate": now.getDate(),
                                       "packageSelectedMonth": now.getMonth()
                                   }
                               });

                               return {status: true, message: "package changed to "+packageData.name};
                           }
                       }
                   });*/
            } else {
                return {
                    status: false,
                    message: "Payment not possible, package changing failed"
                };
            }


        }
    },
    ifRatingsAvailable: function (platformId, startDate, endDate) {
        "use strict";
        if (!platformId || !this.userId) {
            return false;
        }

        var userId = this.userId,
            dl = 3;

        var questions = Questions.find({
            status: {
                $ne: "deleted"
            },
            platformId: platformId,
            userId: userId
        }, {
                limit: dl
            }).fetch();

        // if (noOfDays) {
        //     var timeBarrier = new Date();
        //     timeBarrier.setHours(0);
        //     timeBarrier.setMinutes(0);
        //     timeBarrier.setSeconds(0);
        //     var fromDate = new Date(timeBarrier - (1000 * 60 * 60 * 24 * noOfDays));
        //     console.log("ratedOn Greater than: ", fromDate);
        // }

        var i;
        for (i = 0; i < questions.length; i++) {
            if (startDate && endDate) {
                if (Packets.findOne({
                    questionId: questions[i]._id,
                    status: "rated",
                    ratedOn: {
                        $gte: startDate,
                        $lte: endDate
                    }
                })) {
                    return true;
                }
            } else {
                if (Packets.findOne({
                    questionId: questions[i]._id,
                    status: "rated"
                })) {
                    return true;
                }
            }
        }
        return false;
    },
    getQuestionResults: function (platformId, noOfDays) {
        "use strict";

        // Return value format...
        //
        // results = [
        //   {
        //      'ratingSystem'  : ratingSystem,
        //      'questionId'    : question._id,
        //      'questionText'  : question.text,
        //      'total'         : 0,
        //      'average'       : 0,
        //      'negative'      : 0,
        //      'positive'      : 0,
        //      'detractors'    : 0,
        //      'passives'      : 0,
        //      'promoters'     : 0,
        //      'rating'        : [0, 0, 0, 0, 0, 0, 0, 0],
        //      'responses'     : [{'name': name, 'email': email, 'ratedOn': date, 'rating': rating, 'comment', comment}, ...]]
        //   },
        //   ...
        // ];
        //
        // rating array is length 8 or 10 based on rating system

        console.log("in meteor methods getQuestionResults");

        if (!platformId || !this.userId) {
            return [];
        }

        // >>>> VERY IMPORTANT!!! <<<<
        //
        // Set the ratingSystem here somehow, maybe by checking the type of the platform
        // and determine if it is base8 or base10.
        //
        // Maybe add a new field in the Platform collection called ratingSystem and
        // use it to determine what the value below should be?
        //
        // e.g  var ratingSystem = Platforms.findOne({platformId: platformId}).ratingSystem;
        // (where ratingSystem is set to the string 'base8' or 'base10')
        //
        // Or maybe add a new field in the Packets collection (rating) called ratingSystem and
        // check for its value where we check if we have any rated packets below and use
        // that value to set the ratingSystem type.
        //
        // Anyways the variable below will determine how the ratings are calculated and
        // displayed in the dashboard. The default must be 'base8'
        //
        // UPDATE: March 25, 2017
        // Used a new field in Users collection Users.settings.scaleType (base8, base10)
        // and set default value to base8.
        //
        // UPDATE: December 1, 2017
        // Added scaleType base6
        //
        // >>>> VERY IMPORTANT!!! <<<<

        var BASE_6 = 'base6', BASE_8 = 'base8', BASE_10 = 'base10'; // Choose BASE_6, BASE_8 or BASE_10 only!
        var ratingSystem = BASE_8; // Set rating system to BASE_8 as default
        try {
            ratingSystem = Users.findOne({ _id: this.userId }).settings.scaleType;
        } catch (error) {
            console.log("Error finding scaleType in User collection: ", error);
        }

        console.log("platformId: ", platformId);
        console.log("this.userId: ", this.userId);
        console.log("noOfDays: ", noOfDays);
        console.log("ratingSystem: ", ratingSystem);

        var userId = this.userId, dl = 3;

        console.log("getting questions for user ", userId);
        var questions = Questions.find({ status: { $ne: "deleted" }, platformId: platformId, userId: userId }, { limit: dl }).fetch();

        console.log("questions in getQuestionResults: ");
        console.log(questions);

        if (noOfDays) {
            var timeBarrier = new Date();
            timeBarrier.setHours(0);
            timeBarrier.setMinutes(0);
            timeBarrier.setSeconds(0);
            var fromDate = new Date(timeBarrier - (1000 * 60 * 60 * 24 * noOfDays));
            console.log("ratedOn Greater than: ", fromDate);
        }

        var i, results = [];
        for (i = 0; i < questions.length; i++) {
            var ratings = {};

            if (fromDate) {
                if (Packets.findOne({ questionId: questions[i]._id, status: "rated", ratedOn: { $gt: fromDate } })) {
                    // Find all ratings for this question for the noOfDays given
                    ratings = Packets.find({ questionId: questions[i]._id, status: "rated", ratedOn: { $gt: fromDate } }).fetch();
                }
            } else {
                if (Packets.findOne({ questionId: questions[i]._id, status: "rated" })) {
                    // Find all ratings for this question
                    ratings = Packets.find({ questionId: questions[i]._id, status: "rated" }).fetch();
                }
            }

            // If we have a rated question, then calculate the resultsObj contents
            if (ratings.length) {
                var resultsObj = {
                    questionId: questions[i]._id,
                    questionText: questions[i].text
                };
                console.log("We have a rated question: ", resultsObj);
                // console.log("All ratings for this question: ", ratings);

                // Perform calculations on the rated results
                resultsObj.ratingSystem = ratingSystem; // Set the ratingSystem!
                resultsObj.total = ratings.length;
                resultsObj.average = 0;
                resultsObj.responses = [];

                // Add different fields to resultsObj based on ratingSystem type!
                if (ratingSystem == BASE_6) {
                    resultsObj.detractors = 0;
                    resultsObj.passives = 0;
                    resultsObj.promoters = 0;
                    resultsObj.rating = [0, 0, 0, 0, 0, 0];
                }
                else if (ratingSystem == BASE_8) {
                    resultsObj.negative = 0;
                    resultsObj.positive = 0;
                    resultsObj.rating = [0, 0, 0, 0, 0, 0, 0, 0];
                }
                else if (ratingSystem == BASE_10) {
                    resultsObj.detractors = 0;
                    resultsObj.passives = 0;
                    resultsObj.promoters = 0;
                    resultsObj.rating = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }

                var b, sum = 0;
                for (b = 0; b < ratings.length; b++) {
                    var rating = ratings[b];
                    var score = rating.rating;

                    resultsObj.responses.push({
                        name: rating.receiverName,
                        email: rating.receiverEmail,
                        ratedOn: moment(new Date(rating.receivedTime)).format('MM-DD-YYYY'),
                        rating: rating.rating,
                        comment: rating.comment
                    });

                    sum += score;

                    // These calculations are only for BASE_6 ratingSystem
                    if (ratingSystem == BASE_6) {

                        if (score == 5) {
                            resultsObj.promoters += 1;
                        } else if (score == 4) {
                            resultsObj.passives += 1;
                        } else {
                            resultsObj.detractors += 1;
                        }

                        switch (score) {
                            case 0:
                                resultsObj.rating[0] += 1;
                                break;
                            case 1:
                                resultsObj.rating[1] += 1;
                                break;
                            case 2:
                                resultsObj.rating[2] += 1;
                                break;
                            case 3:
                                resultsObj.rating[3] += 1;
                                break;
                            case 4:
                                resultsObj.rating[4] += 1;
                                break;
                            case 5:
                                resultsObj.rating[5] += 1;
                                break;
                        }

                    }
                    // These calculations are only for BASE_8 ratingSystem
                    else if (ratingSystem == BASE_8) {

                        if (score > 0) {
                            resultsObj.positive += 1;
                        } else {
                            resultsObj.negative += 1;
                        }

                        switch (score) {
                            case -4:
                                resultsObj.rating[0] += 1;
                                break;
                            case -3:
                                resultsObj.rating[1] += 1;
                                break;
                            case -2:
                                resultsObj.rating[2] += 1;
                                break;
                            case -1:
                                resultsObj.rating[3] += 1;
                                break;
                            case 1:
                                resultsObj.rating[4] += 1;
                                break;
                            case 2:
                                resultsObj.rating[5] += 1;
                                break;
                            case 3:
                                resultsObj.rating[6] += 1;
                                break;
                            case 4:
                                resultsObj.rating[7] += 1;
                        }

                    }
                    // These calculations are only for BASE_10 ratingSystem
                    else if (ratingSystem == BASE_10) {

                        if (score >= 9) {
                            resultsObj.promoters += 1;
                        } else if (score >= 7) {
                            resultsObj.passives += 1;
                        } else {
                            resultsObj.detractors += 1;
                        }

                        switch (score) {
                            case 1:
                                resultsObj.rating[0] += 1;
                                break;
                            case 2:
                                resultsObj.rating[1] += 1;
                                break;
                            case 3:
                                resultsObj.rating[2] += 1;
                                break;
                            case 4:
                                resultsObj.rating[3] += 1;
                                break;
                            case 5:
                                resultsObj.rating[4] += 1;
                                break;
                            case 6:
                                resultsObj.rating[5] += 1;
                                break;
                            case 7:
                                resultsObj.rating[6] += 1;
                                break;
                            case 8:
                                resultsObj.rating[7] += 1;
                                break;
                            case 9:
                                resultsObj.rating[8] += 1;
                                break;
                            case 10:
                                resultsObj.rating[9] += 1;
                        }

                    }

                }

                resultsObj.average = (sum / ratings.length).toFixed(2);

                // Push the new calculated results into the results array
                results.push(resultsObj);
            }
        }
        return results;
    },
    getAverageRating: function (platformId, noOfDays, userIdOptional) {
        //console.log("arguments");
        //console.log(arguments);
        // template.data.platform._id, template.data.userId, Number(numberOfDays)
        "use strict";
        if (!platformId || !this.userId) {
            return [];
        }


        var userId = this.userId,
            dl = 3; //limit || 3;

        if (userIdOptional) {
            var user = Meteor.users.findOne({
                _id: this.userId
            });
            if (Roles.userIsInRole(user, ["admin"])) {
                userId = userIdOptional;
            }
        }

        var questions = Questions.find({
            status: {
                $ne: "deleted"
            },
            platformId: platformId,
            userId: userId
        }, {
                limit: dl
            }).fetch();

        var b, questionIdArray = [],
            questionTextArray = {},
            averageQuestions = {};

        for (b = 0; b < questions.length; b++) {
            questionIdArray.push(questions[b]._id);
            questionTextArray[questions[b]._id] = questions[b].text;
        }

        //questionIdArray = ["MRDjR962Aka8gDNxa"];
        //questionTextArray["MRDjR962Aka8gDNxa"] = "test text Question";

        var timeBarrier = new Date();
        timeBarrier.setHours(0);
        timeBarrier.setMinutes(0);
        timeBarrier.setSeconds(0);
        var fromDate = new Date(timeBarrier - (1000 * 60 * 60 * 24 * noOfDays));

        var ratings = Packets.find({
            status: "rated",
            questionId: {
                "$in": questionIdArray
            },
            ratedOn: {
                $gt: fromDate
            }
        }).fetch();

        console.log({
            status: "rated",
            questionId: {
                "$in": questionIdArray
            },
            ratedOn: {
                $gt: fromDate
            }
        });

        if (ratings.length) {
            for (b = 0; b < ratings.length; b++) {
                if (!averageQuestions[ratings[b].questionId]) {
                    averageQuestions[ratings[b].questionId] = {};
                }
                averageQuestions[ratings[b].questionId] = {
                    rating: (averageQuestions[ratings[b].questionId].rating) ? averageQuestions[ratings[b].questionId].rating + ratings[b].rating : ratings[b].rating,
                    number: (averageQuestions[ratings[b].questionId].number) ? averageQuestions[ratings[b].questionId].number + 1 : 1
                };
            }
        }

        var m, result = [];
        for (m in averageQuestions) {
            result.push({
                _id: m,
                text: questionTextArray[m],
                totalRating: averageQuestions[m].rating,
                totalCount: averageQuestions[m].number
            });
        }

        return result;

    },

    getPlatform: function (userId) {
        return Meteor.sessions.findOne({
            "ownerId": userId
        });
    },

    updateUserSettings: function (userId, options) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log(Meteor.user().roles[0])
        if ((Meteor.user().roles) && !(Meteor.user().roles[0] === 'admin' || Meteor.user().roles[0] === 'user')) {
            throw new Meteor.Error("not-authorized");
        }
        if (userId && options) {
            Meteor.users.update({
                _id: userId
            }, options);
            console.log(9497137845);
            return {
                status: true,
                message: "Settings Added"
            };
        }
    },

    updateClientSettings: function (userId, options, pIds, notpIds) {
        console.log("userId")
        console.log(userId)
        console.log(Meteor.userId())
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log(Meteor.user().roles[0])
        if ((Meteor.user().roles) && !(Meteor.user().roles[0] === 'admin' || Meteor.user().roles[0] === 'user')) {
            throw new Meteor.Error("not-authorized");
        }
        if (userId && options) {

            notpIds.forEach(function (item) {
                Sessions.remove({
                    "platformId": item,
                    "ownerId": userId
                });
            })
            console.log(pIds)

            pIds.forEach(function (item) {

                var platformData = Platforms.findOne({
                    "_id": item
                });
                var sessionData = Sessions.findOne({
                    "platformId": item,
                    "ownerId": userId
                })
                if (!sessionData) {
                    var unique = (String(Math.random())).split('.')[1] + Date.now();
                    Sessions.insert({
                        "secret": Random.id(),
                        "key": Random.secret(),
                        "token": [{
                            "hashedToken": unique //bypass unique index for the first time
                        }],
                        "status": true,
                        "platformId": item,
                        "ownerId": userId,
                        "platform_delay": "no_delay",
                        "platform": platformData.name,
                        "email_stream": true
                    });
                }

                //Sessions.update({ownerId:userId}, {$set: {platformId: item,platform: platformData.name}});
            })
            Meteor.users.update({
                _id: userId
            }, options);
            return {
                status: true,
                message: "Settings Added"
            };
        }
    },





    // Ticket Management Dashboard
    commentInsert: function (commentAttributes, newStatus) {
        var ticket = Tickets.findOne(commentAttributes.ticketId);
        var now = new Date();
        if (!ticket) {
            throw new Meteor.Error('invalid-comment', 'You must comment on a ticket');
        }
        comment = _.extend(commentAttributes, {
            submitted: new Date()
        });
        if (newStatus === 'resolved') {
            Tickets.update(comment.ticketId, {
                $set: {
                    status: newStatus,
                    resolvedAt: now
                },
                $inc: {
                    commentCount: 1
                }
            });
        } else {
            Tickets.update(comment.ticketId, {
                $set: {
                    status: newStatus
                },
                $inc: {
                    commentCount: 1
                }
            });
        }
        comment._id = Comments.insert(comment);
        return comment._id;
    },


    ticketemailcommentInsert: function (commentAttributes, newStatus) {
        var ticket = Tickets.findOne(commentAttributes.ticketId);
        var now = new Date();
        if (!ticket) {
            throw new Meteor.Error('invalid-comment', 'You must comment on a ticket');
        }
        ticketemailcomment = _.extend(commentAttributes, {
            submitted: new Date()
        });
        console.log("Before if--------------------------------->")
        if (newStatus === 'resolved') {
            console.log("Between if ---------------------->")
            Tickets.update(ticketemailcomment.ticketId, {
                $set: {
                    status: newStatus,
                    resolvedAt: now
                },
                $inc: {
                    commentCount: 1
                }
            });
        }
        else {

            console.log("Between else ---------------------->")


            Tickets.update(ticketemailcomment.ticketId, {
                $set: {
                    status: newStatus
                },
                $inc: {
                    commentCount: 1
                }
            });
        }
        console.log("After if-------------------------->")
        ticketemailcomment._id = Ticketemailcomments.insert(ticketemailcomment);
        return ticketemailcomment._id;
    }





});

/*

 SearchSource.defineSource('packages', function(searchText, options) {
 var options = {sort: {price: -1}, limit: 20};

 if(searchText) {
 var regExp = buildRegExp(searchText);
 var selector = {$or: [
 {name: regExp},
 {stripeId: regExp}
 ]};

 return Packages.find(selector, options).fetch();
 } else {
 return Packages.find({}, options).fetch();
 }
 });

 function buildRegExp(searchText) {
 // this is a dumb implementation
 var parts = searchText.trim().split(/[ \-\:]+/);
 return new RegExp("(" + parts.join('|') + ")", "ig");
 }
 */


Router.route(
    'DownloadFile', {
        where: 'server',
        path: '/exportUsers/:filename',
        action: function () {
            console.log(this.params);
            return exportCSV(this.response, this.params.filename);
            //this.response.end('some file content\n');
        }
    });


var exportCSV = function (responseStream, fileName) {

    var questionId = fileName.split(".")[0];
    console.log("questionId", questionId);

    var dateCheck = questionId.split("_");

    if (dateCheck.length === 2) {
        questionId = dateCheck[0];
    }

    var question = Questions.find(questionId);

    var userStream = createStream();
    // Set up a future, Stream doesn't work properly without it.
    var fut = new Future();
    var packets = {},
        count = 0,
        dateTime;
    //throw new Error();
    //Here this Package is used to parse a stream from an array to a string of CSVs.
    CSV().from(userStream)
        .to(responseStream)
        .transform(function (packet, index) {
            console.log("transform");

            dateTime = new Date(packet.receivedTime).toDateString() + "#" + new Date(packet.receivedTime).toLocaleTimeString()
            if (packet._id) {
                return [
                    question.text,
                    packet.senderName,
                    packet.senderEmail,
                    packet.receiverName,
                    packet.receiverEmail,
                    packet.delay,
                    packet.status,
                    dateTime,
                    packet.error,
                    packet.finalResult,
                    packet.rating,
                    packet.comment
                ];
            } else {
                return packet;
            }
        })
        .on('error', function (error) {
            console.error('Error streaming CSV export: ', error.message);
        })
        .on('end', function (count) {
            responseStream.end();
            fut.return();
        });

    //Write table headings for CSV to stream.
    userStream.write([
        "Question",
        "senderName",
        "senderEmail",
        "receiverName",
        "receiverEmail",
        "delay",
        "status",
        "receivedTime",
        "error",
        "finalResult",
        "rating",
        "comments"
    ]);

    if (dateCheck.length === 2) {
        var timeBarrier = new Date(),
            numberOfDays = Number(dateCheck[1]);
        timeBarrier.setHours(0);
        timeBarrier.setMinutes(0);
        timeBarrier.setSeconds(0);
        var fromDate = new Date(timeBarrier - (1000 * 60 * 60 * 24 * numberOfDays));
        packets = Packets.find({
            questionId: questionId,
            "status": "rated",
            ratedOn: {
                $gt: fromDate
            }
        }); //.fetch();
    } else {
        packets = Packets.find({
            questionId: questionId,
            "status": "rated"
        }); //.fetch();
    }

    //Pushing each user into the stream, If we could access the MongoDB driver we could
    //convert the Cursor into a stream directly, making this a lot cleaner.
    packets.forEach(function (packet) {
        console.log(packet);
        userStream.write(packet); //Stream transform takes care of cleanup and formatting.
        count += 1;
        if (count >= packets.count())
            userStream.end();
    });

    return fut.wait();
};

//Creates and returns a Duplex(Read/Write) Node stream
//Used to pipe users from .find() Cursor into our CSV stream parser.
var createStream = function () {
    var stream = Npm.require('stream');
    var myStream = new stream.Stream();
    myStream.readable = true;
    myStream.writable = true;

    myStream.write = function (data) {
        myStream.emit('data', data);
        return true; // true means 'yes i am ready for more data now'
        // OR return false and emit('drain') when ready later
    };

    myStream.end = function (data) {
        console.log("myStream.end");
        //Node convention to emit last data with end
        if (arguments.length)
            myStream.write(data);

        // no more writes after end
        myStream.writable = false;
        myStream.emit('end');
    };

    myStream.destroy = function () {
        myStream.writable = false;
    };

    return myStream;
};
