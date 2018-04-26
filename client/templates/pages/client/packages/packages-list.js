var firstRender = true;

Template.packagesList.onRendered(function() {
    if (firstRender) {
        console.log("firstRender");
    }
    else{
        console.log("againRender");
    }
});

Template.packagesList.helpers({
    packagesExists: function() {
        return Packages.find().fetch().length;
    },
    packages: function() {
        return Packages.find();
    }
});

Template.packagesList.events({
    "submit .select-package": function(event, template){
        event.preventDefault();
        var element = template.find('input:radio[name=package]:checked');
        var packageChosen = $(element).val();
        if(packageChosen) {
            console.info("calling");
            Meteor.call("createPlanOnStrip", packageChosen, function (err, id) {
                console.log(err, id);

            });

            /*Meteor.call('stripeUpdateSubscription', plan, function(error, response){
                if (error){
                    downgradeUpgradeButton.button('reset');
                    Bert.alert(error.reason, "danger");
                } else {
                    if (response && response.error){
                        downgradeUpgradeButton.button('reset');
                        Bert.alert(response.error.message, "danger");
                    } else {
                        downgradeUpgradeButton.button('reset');
                        Session.set('currentUserPlan_' + Meteor.userId(), null);
                        Bert.alert("Subscription successfully updated!", "success");
                    }
                }
            });*/
        }
        else{
            alert("please choose a package");
        }
    }
});