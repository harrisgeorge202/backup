var EDITING_KEY = 'ADDING_NEW_PLATFORM';


Template.adminPlatformsEdit.helpers({
    systemIntegrationName: function () {
        var id=Router.current().params._id;
        //return Platforms.find({"system_integration_name":{'$exists':true}}).fetch()
        console.log(1111111111111111111111111111111)
        console.log(Platforms.findOne({"_id":id}).system_integration_name)
        return Platforms.findOne({"_id":id}).system_integration_name
    }
});
Template.adminPlatformsEdit.events({


    "submit #platform-edit-form": function (event, template) {



        // Prevent default browser form submit
        event.preventDefault();
        var l=0;
        var details={};
        system_integration_name=template.$('[name=platformSelection]').val();
        console.log(system_integration_name)
        console.log(Router.current().params._id)
        if(system_integration_name){

            var ids=Platforms.find().fetch()
            //looping
            Object.keys(ids).forEach(function(key) {
            if(ids[key].system_integration_name==system_integration_name){
                if(ids[key]._id!=Router.current().params._id)
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
        Meteor.call("updatePlatform", this._id, details);
        Router.go('adminPlatformsList');

        }else{
            alert(system_integration_name+" Already Exist ")

        }


    }else{
        var details = {
            name: template.$('[name=name]').val(),
            image: template.$('[name=image]').val(),
            description: template.$('[name=description]').val(),
            conn_instructions: template.$('[name=conn_instructions]').val()
        };
    console.log(details)
        Meteor.call("updatePlatform", this._id, details);
        Router.go('adminPlatformsList');
    }


    },






    'click .cancel': function (event) {
        console.log("cancel-new");
        Session.set(EDITING_KEY, null);
        Router.go('adminPlatformsList');
    }
});

Template.adminPlatformsEdit.rendered = function () {
    $("#platform-edit-form").validate({
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
};