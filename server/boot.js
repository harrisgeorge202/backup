/**
 * Created by baboon-soft on 15/12/15.
 */
/*global console, Meteor, Accounts, Roles, Platforms, Questions, Users, Packages */

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
    
        "use strict";
    
        /*
        smtp = {
         username: 'your_username',   // eg: server@gentlenode.com
         password: 'your_password',   // eg: 3eeP1gtizk5eziohfervU
         server:   'smtp.gmail.com',  // eg: mail.gandi.net
         port: 25
         }
    
         process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;*/
    
        if (Platforms.find().count() === 0) {
            Platforms.insert({
                _id: "wGybvHC9m5cZrxeFW",
                name: "Shopify",
                image: "https://cdn.shopify.com/assets/images/shopify-assets/logos/shopify-logo.png?1421778479",
                description: "Everything you need to sell. Build your online store with Shopify's ecommerce software and easily sell in person with Shopify's iPad POS. ",
                conn_instructions: "Ask someone on your right",
                status: true
            });
        }
    
        if (Questions.find().count() === 0) {
            Questions.insert({
                platformId: "wGybvHC9m5cZrxeFW",
                userId: "h7uQfMh2wgr9vMNpk",
                createdOn: new Date(),
                status: "active",
                text: "My first question about Shopify"
            });
        }
    
        if (Users.find().count() === 0) {
            Users.insert({
                "_id": "xiNwsar3X9Lrhpkuw",
                "createdAt": new Date(),
                "services": {
                    "password": {
                        "bcrypt": "$2a$10$UdNnD9LTIvmBFJJt44wmquyRKu8V.NBQ9pqT4Eish5b6QIEj6R.V6"
                    },
                    "resume": {
                        "loginTokens": []
                    }
                },
                "emails": [
                    {
                        "address": "user@baboon-soft.com",
                        "verified": true
                    }
                ],
                "smses": [
                    {
                        "phone": "+16479158642",
                        "verified": true
                    }
                ],
                "status": true,
                "roles": [
                    "user"
                ],
                "profile": {
                    "packageId": "38Wid4wPdm8fBcHrP"
                },
                "availableSMS": true,
                "stripeCustomerId": "cus_7fxCmQl2miVBcQ",
                "packageChosen": "small",
                "packageId": "38Wid4wPdm8fBcHrP",
                "stripeCardToken": "tok_17QbIGARGqlcoHblFdhOUfGv",
                "settings": {
                    "scaleType" : "base8"
                }
            });
    
            // Added for testing BASE_10
            Users.insert({
                "_id": "base10_user",
                "createdAt": new Date(),
                "services": {
                    "password": {
                        "bcrypt": "$2a$10$UdNnD9LTIvmBFJJt44wmquyRKu8V.NBQ9pqT4Eish5b6QIEj6R.V6"
                    },
                    "resume": {
                        "loginTokens": []
                    }
                },
                "emails": [
                    {
                        "address": "user2@baboon-soft.com",
                        "verified": true
                    }
                ],
                "smses": [
                    {
                        "phone": "+16479158642",
                        "verified": true
                    }
                ],
                "status": true,
                "roles": [
                    "user"
                ],
                "profile": {
                    "packageId": "38Wid4wPdm8fBcHrP"
                },
                "availableSMS": true,
                "stripeCustomerId": "cus_7fxCmQl2miVBcQ",
                "packageChosen": "small",
                "packageId": "38Wid4wPdm8fBcHrP",
                "stripeCardToken": "tok_17QbIGARGqlcoHblFdhOUfGv",
                "settings": {
                    "scaleType" : "base10"
                }
            });
    
            /* 1 */
            Users.insert({
                "_id": "K8gDX9K2LgTNL5Bpn",
                "createdAt": new Date(),
                "services": {
                    "password": {
                        "bcrypt": "$2a$10$5UMVbs96U918uYyt/OMJieT6M.DNjpM/OwMqbbmx8Eomagp4dva6G"
                    },
                    "resume": {
                        "loginTokens": []
                    }
                },
                "emails": [
                    {
                        "address": "admin@baboon-soft.com",
                        "verified": true
                    }
                ],
                "smses": [
                    {
                        "phone": "+16479158642",
                        "verified": true
                    }
                ],
                "status": true,
                "roles": [
                    "admin"
                ],
                "profile": {
                    "packageId": "38Wid4wPdm8fBcHrP"
                },
                "availableSMS": true,
                "stripeCustomerId": "cus_7fxDBOObo42P6x",
                "packageChosen": "small",
                "packageId": "38Wid4wPdm8fBcHrP",
                "stripeCardToken": "tok_17QbJ1ARGqlcoHblbdKBnTrn",
                "settings": {
                    "scaleType" : "base10"
                }
            });
        }
    
        // Tickets for testing
        if (Tickets.find().count() === 0) {
            var now = new Date().getTime();
    
            // Note: local, change id for user that will test the tickets, then in mongo console run db.tickets.remove(); and restart the app.
            var id = "Ya2QLcjF8qY5ZAQiq";
            var johnId = Tickets.insert({
                userId: id,
                author: 'John Doe',
                email: 'johnDoe@gmail.com',
                rating: 3,
                created: new Date(now - 1 * 3600 * 1000),
                comment: 'Bad service!!!@@!@!# REEEEEEEEEEEEEE',
                status: 'resolved',
                resolvedAt: new Date(now),
                commentCount: 1
            });
    
            Tickets.insert({
                userId: id,
                author: 'VEeeeeeeeeeeeeeeery long name',
                email: 'rey420@gmail.com',
                rating: 1,
                created: new Date(now - 1 * 3600 * 1000),
                comment: 'Cant smoke weed FeelsBadMan',
                status: 'unresolved',
                resolvedAt: null,
                commentCount: 0
            });
            Tickets.insert({
                userId: id,
                author: 'Chloe Smith',
                email: 'cutiepie89@gmail.com',
                rating: 2,
                created: new Date(now - 1 * 3600 * 1000),
                comment: 'you guys ran out of smoothies? UNACCEPTABLE!',
                status: 'unresolved',
                resolvedAt: null,
                commentCount: 0
            });
    
            Comments.insert({
                userId: id,
                ticketId: johnId,
                name: 'Stacy',
                submitted: new Date(now - 4 * 3600 * 100),
                body: 'Calmed him down with a free snack menu'
            });
    
            for (var i = 0; i < 15; i++) {
                if (i < 5) {
                    Tickets.insert({
                        userId: id,
                        author: 'Test ticket #' + i,
                        email: 'email@mail.com',
                        rating: Math.floor(Math.random() * 6) + 1,
                        created: new Date(now - i * 3600 * 100),
                        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                        status: 'unresolved',
                        resolvedAt: null,
                        commentCount: 0
                    });
                } else {
                    Tickets.insert({
                        userId: id,
                        author: 'Test ticket #' + i,
                        email: 'email@mail.com',
                        rating: Math.floor(Math.random() * 6) + 1,
                        created: new Date(now - i * 3600 * 100),
                        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                        status: 'resolved',
                        resolvedAt: new Date(now),
                        commentCount: 0
                    });
                }
            }
        }
    
    
        // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
        Accounts.emailTemplates.from = 'Fetch App <fetchapp@getfetch.ca>';
    
        // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
        Accounts.emailTemplates.siteName = 'Fetch App';
    
        // A Function that takes a user object and returns a String for the subject line of the email.
        Accounts.emailTemplates.verifyEmail.subject = function (user) {
            return 'Confirm Your Email Address';
        };
    
        // A Function that takes a user object and a url, and returns the body text for the email.
        // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
        Accounts.emailTemplates.verifyEmail.text = function (user, url) {
            var greeting = (user.profile && user.profile.name) ?
                ("Hello " + user.profile.name + ",") : "Hello,";
            return greeting +
                "\n" +
                "\n" +
                "To verify your account email, simply click the link below.\n" +
                "\n" +
                url +
                "\n" +
                "\n" +
                "Thanks.\n";
        };
    
        Accounts.urls.resetPassword = function (token) {
            return Meteor.absoluteUrl('reset-password/' + token);
        };
    
        Accounts.onCreateUser(function (options, user) {
            console.log("onCreateUser");
            console.log("user");
            console.log(user);
            console.log("options");
            console.log(options);
            Meteor.setTimeout(function () {
                //Add user role for package alanning:roles
                if (user) {
                    Roles.addUsersToRoles(user._id, ['user']);
                    // Accounts.sendVerificationEmail(user._id);
                }
            }, 2000);
    
            // Have you sent any profile data from client?
            // This is the only fields that can be modified by client.
            if (options.profile) {
                user.profile = options.profile;
            } else {
                user.profile = {
                    //"delay": "no_delay",
                    "inEmail": options.email
                };
            }
    
            user.status = true;
    
            //user.packageChosen = false;
            return user;
        });
    
        Accounts.onLogin(function (a) {
            console.log("user logged in Accounts.onLogin()");
            //console.log("a");
            //console.log(a.user);
        });
    
        Accounts.validateLoginAttempt(function (attempt) {
            return !(attempt.user && attempt.user.status !== true);
        });
    
    });
    