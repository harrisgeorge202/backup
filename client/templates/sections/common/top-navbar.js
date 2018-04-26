
Template.topNavbar.rendered = function(){
    
        // FIXED TOP NAVBAR OPTION
        // Uncomment this if you want to have fixed top navbar
        $('body').addClass('fixed-nav');
        $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
    
    };
    
    Template.topNavbar.events({
    
        'click .js-logout': function() {
            Meteor.logout();
            Router.go('home');
            // if we are on a private list, we'll need to go to a public one
            /*var current = Router.current();
             if (current.route.name === 'listsShow' && current.data().userId) {
             Router.go('listsShow', Lists.findOne({userId: {$exists: false}}));
             }*/
        },
    
        // Toggle left navigation
        'click #navbar-minimalize': function(event){
    
            event.preventDefault();
    
            // Toggle special class
            $("body").toggleClass("mini-navbar");
    
            // Enable smoothly hide/show menu
            if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                // Hide menu in order to smoothly turn on when maximize menu
                $('#side-menu').hide();
                // For smoothly turn on menu
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(500);
                    }, 100);
            } else if ($('body').hasClass('fixed-sidebar')) {
                $('#side-menu').hide();
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(500);
                    }, 300);
            } else {
                // Remove all inline style from jquery fadeIn function to reset menu state
                $('#side-menu').removeAttr('style');
            }
        }
    
    });
    
    Template.topNavbar.helpers({
        emailLocalPart: function () {
            var dispName;
            if(Meteor.user().profile && Meteor.user().profile.name){
                dispName = Meteor.user().profile.name;
            }else{
                dispName = Meteor.user().emails[0].address;
                dispName = dispName.substring(0, dispName.indexOf('@'));
            }
            return dispName;
        },
        isAdmin: function(){
            console.log(Meteor.user().roles && Meteor.user().roles[0] == "admin");
            return Meteor.user().roles && Meteor.user().roles[0] == "admin";
        },
        isUser: function(){
            console.log(Meteor.user().roles && Meteor.user().roles[0] == "user");
            return Meteor.user().roles && Meteor.user().roles[0] == "user";
        }
    });
    