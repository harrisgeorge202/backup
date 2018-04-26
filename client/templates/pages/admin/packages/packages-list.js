var EDITING_KEY = 'ADDING_NEW_PACKAGE';

Template.adminPackagesList.helpers({
    packages: function () {
        return Packages.find({},{sort:{price:1}});
    },
    editingOne: function(){
        return Session.get(EDITING_KEY);
    },
    testThisX:function(){

}
});


Template.adminPackagesList.events({
    'click #add-new': function (event) {
        console.log("add-new");
        Session.set(EDITING_KEY, true);
        setTimeout(function(){
            console.log("bound");
            $("#package-add-form").validate({
                rules: {
                    name: {
                        required: true
                    },
                    description: {
                        required: true
                    },
                    monthlyEmailLimit: {
                        required: true,
                        number: true
                    },
                    price: {
                        required: true,
                        number: true
                    }
                }
            });
        },1000);
    },
    'click .cancel': function (event) {
        console.log("cancel-new");
        Session.set(EDITING_KEY, null);
    },
    'click .delete': function (event) {
        console.log("delete");
        var id = $(event.target).attr('id');
        if(id){
            swal({
                    title: "Are you sure?",
                    text: "Your will not be able to recover this package!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function (isConfirm) {
                    if (isConfirm) {
                            Meteor.call("deletePackage", id);
                        swal("Deleted!", "Package has been deleted.", "success");
                    } else {
                        swal("Cancelled", "Package not deleted :)", "error");
                    }
                });
        }
    },
    "submit #package-add-form": function (event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        var details = {
            name: template.$('[name=name]').val(),
            monthlyEmailLimit: Number(template.$('[name=monthlyEmailLimit]').val()),
            price: Number(template.$('[name=price]').val()),
            description: template.$('[name=description]').val(),
            public: template.$('[name=public]').is(":checked"),
            status: template.$('[name=status]').is(":checked")
        };
        console.log(details);
        if(details.name && details.description && details.monthlyEmailLimit && details.price) {
            //details.price = Number(details.price);
            Meteor.call("createPackage", details, function(err, response){
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
            Session.set("WAITING", true);
            Session.set(EDITING_KEY, null);
        }
        else{
            alert('required details not found');
        }
    }
});

Template.adminPackagesList.rendered = function () {
    $("#package-add-form").validate({
        rules: {
            name: {
                required: true
            },
            description: {
                required: true
            },
            monthlyEmailLimit: {
                required: true,
                number: true
            },
            price: {
                required: true,
                number: true
            }
        }
    });
};
