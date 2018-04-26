var EDITING_KEY = 'ADDING_NEW_PACKAGE';

Template.adminPackageEdit.events({
    "submit #package-edit-form": function (event, template) {
        // Prevent default browser form submit
        event.preventDefault();
        //console.log(template.find('[name=public]').checked);
        //finding whether we need to update Stripe for the name.

        var newName = template.$('[name=name]').val();

        var newDescription = template.$('[name=description]').val();

        var details = {
            monthlyEmailLimit: Number(template.$('[name=monthlyEmailLimit]').val()),
            public: template.$('[name=public]').is(":checked"),
            status: template.$('[name=status]').is(":checked")
        };

        if (!newName) {
            alert('Name is required');
        }
        else {
            if (newName !== this.name) {
                details.name = newName;
            }
        }
         if (!newDescription) {
            alert('Description is required');
        }
        else {
            if (newDescription !== this.description) {
                details.description = newDescription;
            }
        }


        if (details.monthlyEmailLimit) {
            console.log("this.name && new Name");
            console.log(this.name, details.name);
            Meteor.call("updatePackage", this._id, details, function(err, response){
                console.log("got callback?");
                console.log(err);
                console.log(response);
                if(err){
                    alert(err);
                }
                else{
                    if(response.error){
                        alert(response.message);
                    }
                }
            });
            Router.go('adminPackagesList');
        }
        else {
            alert('monthlyEmailLimit is required');
        }
    },
    'click .cancel': function (event) {
        console.log("cancel-new");
        Session.set(EDITING_KEY, null);
        Router.go('adminPackagesList');
    }
});

Template.adminPackageEdit.rendered = function () {
    $("#package-edit-form").validate({
        rules: {
            name: {
                required: true
            },
            description: {
                required: true
            },
            monthlyEmailLimit: {
                required: true
            },
            price: {
                required: true
            }
        }
    });
};