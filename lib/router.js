Router.configure({
    
        // we use the  appBody template to define the layout for the entire app
        layoutTemplate: 'mainLayout',
    
        // the appNotFound template is used for unknown routes and missing lists
        notFoundTemplate: 'appNotFound',
    
        // show the appLoading template whilst the subscriptions below load their data
        loadingTemplate: 'appLoading',
    
        // wait on the following subscriptions before rendering the page to ensure
        // the data it's expecting is present
        waitOn: function () {
            return [
                Meteor.subscribe('platforms'),
                Meteor.subscribe('packages')
            ];
        }
    });
    
    if (Meteor.isClient) {
        // Show the loading screen on desktop
        Router.onBeforeAction('loading', {
            except: ['join', 'login', 'landing']
        });
        Router.onBeforeAction('dataNotFound', {
            except: ['join', 'login', 'landing']
        });
    }
    Router.route('loading', {
        path: "/loading",
        action: function () {
            this.render('appLoading');
        }
    });
    // User login / sign-up section routers
    Router.route('join', {
        path: "/join",
        layoutTemplate: 'blankLayout',
        action: function () {
            if (Meteor.userId()) {
                console.info('render home');
                Router.go('home');
            } else {
                this.render('join')
            }
        }
    });
    
    Router.route('login', {
        path: "/login",
        layoutTemplate: 'blankLayout',
        action: function () {
            if (Meteor.userId()) {
                console.info('render home');
                Router.go('home');
            } else {
                this.render('login');
            }
        }
    });
    
    Router.route('landing', {
        path: "/landing",
        action: function () {
            if (Meteor.userId()) {
                console.info('render home');
                Router.go('home');
            } else {
                this.render('landing');
            }
        }
    });
    
    Router.route('forgotPassword', {
        path: "/forgotPassword",
        layoutTemplate: 'blankLayout',
        action: function () {
            if (Meteor.userId()) {
                console.info('render home');
                Router.go('home');
            } else {
                this.render('forgotPassword');
            }
        }
    });
    
    Router.route('reset-password', {
        path: "/reset-password/:_resetPasswordToken",
        layoutTemplate: 'blankLayout',
        onBeforeAction: function () {
            Session.set('resetPassword', this.params._resetPasswordToken);
        },
        action: function () {
            if (Meteor.userId()) {
                console.info('render home');
                Router.go('home');
            } else {
                this.render('resetPassword');
            }
        }
    });
    
    Router.route('platformsItem', {
        path: '/platforms/:_id',
        onBeforeAction: function () {
            console.log(this.params._id);
            this.sessionHandle = Meteor.subscribe('authKeys', this.params._id);
        },
        data: function () {
            return Platforms.findOne(this.params._id);
        },
        action: function () {
            this.render('platformsItem');
        }
    });
    
    Router.route('paymentDetails', {
        path: '/payment/:_id',
        onBeforeAction: function () {
            this.cardsHandle = Meteor.subscribe('savedCards', this.params._id);
        },
        data: function () {
            return Packages.findOne(this.params._id);
        },
        action: function () {
            this.render('paymentView');
        }
    });
    
    Router.route('questionsView', {
        path: '/questions/:_id',
        onBeforeAction: function () {
            console.log(this.params._id);
            this.sessionHandle = Meteor.subscribe('authKeys', this.params._id);
    
            if (!Meteor.userId() || !Meteor.user()) {
                Router.go('home');
            } else {
                this.questionsHandle = Meteor.subscribe('questions', this.params._id); //, Session.get('limit')
                this.userHandle = Meteor.subscribe('userDetails');
            }
        },
        data: function () {
            return Platforms.findOne(this.params._id);
        },
        action: function () {
            this.render('questionsView');
        }
    });
    
    Router.route('platformsList', {
        path: '/platforms',
        // subscribe to platforms before the page is rendered but don't wait on the
        // subscription, we'll just render the items as they arrive
        onBeforeAction: function () {
            //this.platformsHandle = Meteor.subscribe('userList');
            if (!Meteor.userId()) {
                Router.go('login');
            } else {
                var user = Meteor.user();
                if (user && user.profile && !user.profile.packageId) {
                    console.log("setting packageChosen");
                    Session.set("choosePackage", true);
                    Router.go('packages');
                }
            }
        },
        action: function () {
    
            this.render('platformsList');
        },
        waitOn: function () {
            var userid = Meteor.userId();
            return [
                Meteor.subscribe('sessions', userid),
            ];
        }
    });
    
    
    Router.route('specialLink', {
        path: '/special/:_id',
        onBeforeAction: function () {
            if (!Meteor.userId()) {
                Router.go('login');
            }
        },
        data: function () {
            return {
                link: this.params._id
            };
        },
        action: function () {
            this.render('specialLink');
        }
    });
    
    
    Router.route('packages', {
        path: '/packages',
        onBeforeAction: function () {
            if (!Meteor.userId()) {
                Router.go('login');
            }
        },
        action: function () {
            this.render('packagesList');
        }
    });
    
    Router.route('profileSettings', {
        path: '/profile',
        onBeforeAction: function () {
            if (!Meteor.userId()) {
                Router.go('login');
            }
        },
        data: function () {
            return Meteor.user() && Meteor.user().profile;
        },
        action: function () {
            this.render('profileSettings');
        }
    });
    Router.route('sentimentAnalysis', {
        path: '/sentiment_analysis/:_id',
        onBeforeAction: function () {
            if (!Meteor.userId()) {
                Router.go('login');
            }
        },
        data: function () {
          return Platforms.findOne(this.params._id);
        },
        action: function () {
            if(Meteor.users.findOne({_id : Meteor.userId()}).sentimentAnalysisDashboard){
                this.render('sentimentAnalysis');
            }else {
                this.render('appNotFound')
            }
          
        },
        waitOn: function () {
            return [
                Meteor.subscribe('userDetails'),
                Meteor.subscribe('questions', this.params._id),
                Meteor.subscribe('syntaxanalyse', this.params._id),
                Meteor.subscribe('syntaxanalysetotal', this.params._id)
            ];
        }
    });

    Router.route('clientMailSettings', {
        path: '/settings',
        onBeforeAction: function () {
            if (!Meteor.userId()) {
                Router.go('login');
            } else {
                this.usersHandle = Meteor.subscribe('userDetails');
            }
        },
        data: function () {
            return Meteor.user() && Meteor.user().profile;
        },
        action: function () {
            this.render('ClientMailSettings');
        },
        waitOn: function () {
            return [
                Meteor.subscribe('settingsSessions'),
            ];
        }
    });
    
    Router.route('home', {
        path: '/',
        layoutTemplate: 'blankLayout',
        onBeforeAction: function () {
            if (!!Meteor.userId() && !!Meteor.user()) {
                console.log(Meteor.user());
                if (Meteor.user().roles && Meteor.user().roles[0] == 'admin') {
                    Router.go('dashboard');
                } else {
                    var user = Meteor.user();
                    console.log("user");
                    console.log(user);
                    console.log(user && user.profile && user.profile.packageId);
                    if (user && user.profile && user.profile.packageId) {
                        console.log("true");
                        Router.go('dashboard');
                    } else {
                        console.log("setting packageChosen");
                        Session.set("choosePackage", true);
                        Router.go('packages');
                    }
                }
            }
        },
        action: function () {
            this.render('login');
        }
    });
    
    Router.route('adminUsersList', {
        path: '/admin/clients',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go login");
                Router.go('login');
            } else {
                this.usersHandle = Meteor.subscribe('userList');
                Meteor.subscribe('packagesAll');
            }
        },
        action: function () {
            this.render('adminUsersList');
        }
    });
    
    Router.route('adminPlatformsList', {
        path: '/admin/platforms',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go login");
                Router.go('login');
            }
        },
        action: function () {
            this.render('adminPlatformsList');
        }
    });
    
    Router.route('adminPlatformsEdit', {
        path: '/admin/platforms/:_id',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go login");
                Router.go('login');
            }
        },
        data: function () {
            return Platforms.findOne(this.params._id);
        },
        action: function () {
            this.render('adminPlatformsEdit');
        }
    });
    
    
    
    
    /*Router.route('adminClientSettings', {
        path: '/admin/settings/:_id',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go login");
                Router.go('login');
            }
        },
        data: function () {
            return Sessions.findOne(this.params._id);
        },
        action: function () {
            this.render('adminClientSettings');
        }
    });
    */
    
    
    
    
    
    Router.route('adminPackagesList', {
        path: '/admin/packages',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go login");
                Router.go('login');
            } else {
                Meteor.subscribe('packagesAll');
            }
        },
        action: function () {
            this.render('adminPackagesList');
        }
    });
    
    Router.route('adminPackageEdit', {
        path: '/admin/package/:_id',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go login");
                Router.go('login');
            } else {
                Meteor.subscribe('packagesAll');
            }
        },
        data: function () {
            return Packages.findOne(this.params._id);
        },
        action: function () {
            this.render('adminPackageEdit');
        }
    });
    
    //dashboard
    
    Router.route('dashboard', {
        path: '/dashboard',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user()) {
                Router.go('home');
            } else {
                if (Meteor.user().roles && Meteor.user().roles[0] === 'admin') {
                    this.usersHandle = Meteor.subscribe('userList');
                } else {
                    this.sessionsHandle = Meteor.subscribe('feedback');
                    Meteor.subscribe('ticketDashboardField');
                }
            }
        },
        action: function () {
            if (Meteor.user().roles && Meteor.user().roles[0] === 'admin') {
                this.render('adminDashboard');
            } else {
                this.render('dashboard');
            }
        }
    });
    
    Router.route('analyticsDashboard', {
        path: '/analytics-dashboard',
        onBeforeAction: function () {
            console.log("-------analytics-dashboard----------")
            console.log("Meteor.user()", Meteor.user())
            console.log("Meteor.userId()", Meteor.userId())
            Meteor.userId()
            if (!Meteor.userId() || !Meteor.user()) {
                console.log("-------home----------")
                Router.go('home');
            } else {
                if (Meteor.user().roles && Meteor.user().roles[0] === 'admin') {
                    console.log("-------admin----------")
                    this.usersHandle = Meteor.subscribe('userList');
                } else {
                    console.log("-------feedback----------")
                    this.sessionsHandle = Meteor.subscribe('feedback');
                }
            }
        },
        action: function () {
            if (Meteor.user().roles && Meteor.user().roles[0] === 'admin') {
                this.render('adminDashboard');
            } else {
                this.render('analyticsDashboard');
            }
        }
    });
    
    Router.route('adminDashboardOuterList', {
        path: '/dashboard/user/:_id',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go home");
                Router.go('home');
            } else {
                this.sessionsHandle = Meteor.subscribe('feedback', this.params._id);
            }
        },
        action: function () {
            this.render('adminDashboardOuterList');
        }
    });
    
    Router.route('dashboardList', {
        path: '/dashboard/:_id',
        onBeforeAction: function () {
            if (!Meteor.userId()) {
                Router.go('login');
            }
        },
        data: function () {
            console.log(Platforms.findOne(this.params._id));
            return Platforms.findOne(this.params._id);
        },
        action: function () {
            this.render('dashboardList');
        }
    });
    
    
    Router.route('adminDashboardList', {
        path: '/dashboard/platform/:_id/:userId',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go home");
                Router.go('home');
            }
        },
        data: function () {
            console.log(Platforms.findOne(this.params._id));
            return {
                platform: Platforms.findOne(this.params._id),
                userId: this.params.userId,
                previousPath: '/dashboard/user/' + this.params.userId
            };
        },
        action: function () {
            this.render('adminDashboardList');
        }
    });
    
    // Admin settings page
    
    Router.route('adminClientSettings', {
        path: '/admin/client-settings/:_id',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Meteor.user() || !Meteor.user().roles || Meteor.user().roles[0] !== 'admin') {
                console.info("go login");
                Router.go('login');
            } else {
                this.usersHandle = Meteor.subscribe('userList');
                Meteor.subscribe('packagesAll');
            }
        },
        action: function () {
            this.render('clientSettingsForm');
        },
        waitOn: function () {
            return [
                Meteor.subscribe('sessions', this.params._id),
            ];
        }
    
    });
    
    // Ticket Management Dashboard
    
    Router.route('ticketManagement', {
        path: '/ticket-management/',
        // layoutTemplate: 'ticketManagementLayout',
        // yieldTemplates: {
        //     'ticketsList': {
        //         to: 'tickets'
        //     },
        //     'ticketViewEmpty': {
        //         to: 'ticketView'
        //     },
        //     'analytics': {
        //         to: 'analytics'
        //     }
        // },
        waitOn: function () {
            return [
                Meteor.subscribe('tickets', Meteor.userId()),
                Meteor.subscribe('userDetails')
            ];
        },
        action: function () {
            if ( this.ready() ){
                console.log(Meteor.users.findOne({_id : Meteor.userId()}))
                if(Meteor.users.findOne({_id : Meteor.userId()}).ticketDashboard){
                    this.layout('ticketManagementLayout');
                    this.render('ticketsList', {to: 'tickets'});
                    this.render('ticketViewEmpty', {to: 'ticketView'});
                    this.render('analytics', {to: 'analytics'});
                }else {
                    this.render('appNotFound')
                }
            }
        },
    });
    

    Router.route('ticketView', {
        path: '/ticket-management/:_id',
        name: 'ticketView',
        layoutTemplate: 'ticketManagementLayout',
        yieldTemplates: {
            'ticketsList': {
                to: 'tickets'
            },
            'ticketView': {
                to: 'ticketView'
            },
            'analytics': {
                to: 'analytics'
            }
        },
        waitOn: function () {
            return [
                Meteor.subscribe('tickets', Meteor.userId()),
                Meteor.subscribe('ticketView', this.params._id),
                Meteor.subscribe('comments', this.params._id),



                Meteor.subscribe('ticketemailcomments', this.params._id)


                
            ];
        },
        data: function () {
            return Tickets.findOne(this.params._id);
        }
    });
    