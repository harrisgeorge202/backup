var EDITING_KEY = 'ADDING_NEW_PLATFORM';

Template.adminPlatformsList.helpers({
    platformsExists: function () {
        return Platforms.find().fetch().length;
    },
    platforms: function () {
        return Platforms.find();
    },
    editingOne: function () {
        return Session.get(EDITING_KEY);
    }
});


Template.adminPlatformsList.events({
    'click #add-new': function (event) {
        console.log("add-new");
        Session.set(EDITING_KEY, true);
        setTimeout(function () {
            $("#platform-add-form").validate({
                rules: {
                    name: {
                        required: true
                    },
                    description: {
                        required: true
                    }
                }
            });
            $('#conn_instructions').summernote({
                toolbar: [
                    // [groupName, [list of button]]
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['font', ['strikethrough', 'superscript', 'subscript']],
                    ['fontsize', ['fontsize']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']]
                ]
            });
        }, 1000);
    },
    'click .cancel': function (event) {
        console.log("cancel-new");
        Session.set(EDITING_KEY, null);
    },
    'click .delete': function (event) {
        console.log("delete-this");
        var id = $(event.target).attr('id');

        if (id) {
            swal({
                    title: "Are you sure?",
                    text: "Your will not be able to recover this platform!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        Meteor.call("deletePlatform", id);
                        swal("Deleted!", "Platform has been deleted.", "success");
                    } else {
                        swal("Cancelled", "Platform not deleted :)", "error");
                    }
                });
        }
    },
    "submit #platform-add-form": function (event, template) {
        // Prevent default browser form submit
        event.preventDefault();
        var l=0;
        system_integration_name=template.$('[name=platformSelection]').val();
        console.log(system_integration_name)
        if(system_integration_name){
        /////////////////////////////////////////////////////////

            var ids=Platforms.find().fetch()
            //looping
            Object.keys(ids).forEach(function(key) {
            if(ids[key].system_integration_name==system_integration_name){
                l++;
                }
            });
            console.log(l + " have same platform")
            if(l==0){

                details = {
                name: template.$('[name=name]').val(),
                image: template.$('[name=image]').val(),
                description: template.$('[name=description]').val(),
                conn_instructions: template.$('[name=conn_instructions]').val(), 
                system_integration_name:system_integration_name   
                };
                 console.log(details)

            if (details.name && details.description) {
                console.log("Created Platform with system_integration_name")
                Meteor.call("createPlatform", details);
                Session.set(EDITING_KEY, null);
            }

        }else{
            alert(system_integration_name+" Already Exist ")
        }
        /////////////////////////////////////////////////////////////



    }else{
            var details = {
            name: template.$('[name=name]').val(),
            image: template.$('[name=image]').val(),
            description: template.$('[name=description]').val(),
            conn_instructions: template.$('[name=conn_instructions]').val()    
            };
        if (details.name && details.description) {
            console.log("Created Platform without system_integration_name")
            Meteor.call("createPlatform", details);
            Session.set(EDITING_KEY, null);
            }
    }





        /*if (details.name && details.description) {
            Meteor.call("createPlatform", details);
            Session.set(EDITING_KEY, null);
        }*/

    }
});

Template.adminPlatformsList.onRendered(function () {
    console.log("onRendered");
    $("#platform-add-form").validate({
        rules: {
            name: {
                required: true
            },
            description: {
                required: true
            }
        }
    });

    //making sure editor get initialized
    setTimeout(function () {
        $('#conn_instructions').summernote({
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]
        });
    }, 1000);

});
