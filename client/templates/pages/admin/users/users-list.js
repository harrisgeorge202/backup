/**
 * Created by baboon-soft on 31/12/15.
 */
/*var options = {
 keepHistory: 1000 * 60 * 5,
 localSearch: true
 };
 var fields = ['name', 'stripeId'];

 PackageSearch = new SearchSource('packages', fields, options);*/

var SEARCH_KEY = 'userSearch';
Session.setDefault(SEARCH_KEY, false);

Template.adminUsersList.helpers({
    usersReady: function () {
        return Router.current().usersHandle.ready();
    },
    users: function () {
        var searchText = Session.get(SEARCH_KEY);
        if (searchText) {
            var selector = {
                "profile.name": new RegExp(searchText, "ig"),
                roles: 'user'
            };
            return Meteor.users.find(selector, {sort: {'createdAt': -1}}).fetch();
        }
        else {
            console.log(Meteor.users.find({roles: 'user'}, {sort: {'createdAt': -1}}).fetch())
            return Meteor.users.find({roles: 'user'}, {sort: {'createdAt': -1}}).fetch();
        }
    },
    search: function () {
        return Session.get(SEARCH_KEY);
    }
});

Template.adminUsersList.events({
    "submit #search-user-form": function (event, template) {
        console.log(event, "event");

        // Prevent default browser form submit
        event.preventDefault();

        console.log(template.$('[name=search]').val());
        Session.set(SEARCH_KEY, template.$('[name=search]').val());
    }
});

Template.Ulist.helpers({
    addressCapture: function () {
        var email = this.address;
        return email.substring(0, email.indexOf('@'));
    },
    emailsSent: function (packageEmailLimit, monthlyEmailLimit) {
        //console.log("arguments");
        //console.log(arguments);
        if (packageEmailLimit) {
            return packageEmailLimit - monthlyEmailLimit;
        }
        else {
            return 0;
        }
    },
    packages: function () {
        return Packages.find();
    },
    testDee: function (packageName) {
        //console.log('Template.parentData(1)');
        //console.log(Template.parentData(1));
        return (Template.parentData(1).packageId === packageName) ? "selected" : "";
    },
    getPackageName: function (packageId) {

        if (packageId) {
            var b, packageName, allPackages = Packages.find().fetch();
            console.log("allPackages");
            console.log(allPackages);
            for (b = 0; b < allPackages.length; b++) {
                if (allPackages[b]._id === packageId) {
                    packageName = allPackages[b].name;
                    //console.log(allPackages[b].name);
                }
            }
            if (packageName) {
                return "Package:" + packageName;
            }
            else {
                return "Choose package";
            }
        } else {
            return "Choose package";
        }
    }
});

Template.Ulist.events({
    'click .status': function (event, template) {
        console.log('selectId', this._id);
        var status = false;
        if ($(event.target).hasClass('danger-has')) {
            status = true;
        }
        console.log(status);
        Meteor.call("changeUserStatus", this._id, status);
    },
    'change .package-selection': function (event, template) {
        var packageId = $(event.target).val();
        console.log(packageId);
        if (packageId) {
            Meteor.call("updateUserPlan", this._id, packageId, function () {
                console.log("arguments in callback");
                console.log(arguments);
            });
        }
        else {
            swal("Action failed", "Removing package from a user is not allowed", "error");
        }
    }
});
