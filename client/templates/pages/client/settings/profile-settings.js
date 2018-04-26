/**
 * Created by baboon-soft on 31/12/15.
 */

emailList = [];
smsList = [];
Template.profileSettings.helpers({
    inEmail: function () {
        if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.inEmail) {
            return Meteor.user().profile.inEmail;
        }
        else if (Meteor.user() && Meteor.user().emails[0].address) {
            return Meteor.user().emails[0].address;
        }
        else {
            return "";
        }
    },
    findEmail: function () {
        var emails=Meteor.user().profile.emails;
            return emails;
    },
    findSms: function () {
        var smses=Meteor.user().profile.smses;
            return smses;
    }

});

Template.profileSettings.events({
    'input #newEmail' : function(event) {
        event.preventDefault();
          var input = $.trim($("#newEmail").val());
          var invalidMessage;
    
        if(isEmail(input)) {
          removeEmailError();
            if(!emailList.includes(input)) {
                removeEmailError();
            } else {
                invalidMessage = "Email address is already on the list";
                setEmailError(invalidMessage);
            }
        }
        else if (input == "") {
          removeEmailError();
        } else {
            invalidMessage = "Please enter correct email address";
            setEmailError(invalidMessage);
        }
    },
    'input #newSms' : function(event) {
        event.preventDefault();
        var input = $("#newSms").val().replace(/\D/g,'');	
          var invalidMessage;	
    
        if(isNumberUS(input)) {
          //Number is valid
          removeSmsError();
          
            if(!smsList.includes(input) &&
          !smsList.includes('+1' + input) &&
          !smsList.includes('1' + input) &&
          !smsList.includes(input.substring(1)) &&
          !smsList.includes(input.substring(2)) &&
          !smsList.includes('+' + input)) {
              //Number is unique
                removeSmsError();
            }
          else {
                invalidMessage = "Phone number is already on the list";
                setSmsError(invalidMessage);
          }
            
    
        } else if (input == "") {
            // input is empty
            removeSmsError();
        } else {
            invalidMessage = "Please enter correct phone number";
            setSmsError(invalidMessage);
        }
    },
    'click #removeEmail' : function(event,div) {
        
          //var parent = event.target.parentNode.parentNode.parentNode;
          var parent = event.target.parentNode.parentNode;
		  var inputValue = $(parent).find( "input" ).val();
		  var index;
		  if(isEmail(inputValue)) {
			  index = emailList.indexOf(inputValue);
			  if (index > -1) {
				emailList.splice(index, 1);
				if(inputValue === $('#newEmail').val()) {
					removeEmailError();
					}
				}
		  } else if (isNumberUS(inputValue)) {
			  index = smsList.indexOf(inputValue);
			  if (index > -1) {
				smsList.splice(index, 1);
				if(inputValue === $('#newSms').val()) {
					removeSmsError();
				}
			   }
		  } else {
			  console.log("Something wrong is happening");
		  }
		  
		  parent.parentNode.removeChild(parent);
    },
     'click #addEmail': function (event) {
        event.preventDefault();
        var template = Template.instance();
        var selectEl = template.find("#newEmail");
        var text=selectEl.value;
        // var selectEl = $('input[name="email"]').val();
        // var text = $('input[name="email"]').val();


        if(text==""){
            //alert("Please Add Email Address")
        }else{
               
                var Settings = {
                    inEmail: text
                };

                // if (text)
                //     Meteor.call("addQuestion", this._id, text);
                // Clear form
                

                var div=document.createElement('div');
                //$('input[name="email"]').attr("value", "");
                div.innerHTML='<div id="rE"><div class="row"><div class="col-md-6"><input type="text" id="newEmails" class="form-control" name="emails[]" disabled="disabled" value="'+text+'"/></div><div class="col-xs-3"><button id="removeEmail" class="js-delete-item delete-item btn btn-outline btn-danger" type="button">Remove</button></div></div></div></div>'
                document.getElementById('emails').appendChild(div);
                selectEl.value="";
               // Session.set(EDITING_KEY, null);
               emailList.push(text);
        }
    },
    'click #addSms': function (event) {
        event.preventDefault();

        var template = Template.instance();
        var selectEl = template.find("#newSms");
        var text = selectEl.value.replace(/\D/g,'');
		
        if(text==''){
            //alert("Please Add SMS phone number")
        }else{
			if(text.length == 10) {
				text = "+1" + text;
			} else if (text.length == 11) {
				text = "+" + text;
			}
			
			var Settings = {
				inSms: text
			};

			// if (text)
			//     Meteor.call("addQuestion", this._id, text);
			// Clear form

			var div=document.createElement('div');
			//$('input[name="sms"]').attr("value", "");
			div.innerHTML='<div id="rS"><div class="row"><div class="col-md-6"><input type="text" id="newSms" class="form-control smses" name="smses[]" disabled="disabled" value="'+text+'"/></div><div class="col-xs-3"><button id="removeEmail" class="js-delete-item delete-item btn btn-outline btn-danger" type="button">Remove</button></div></div></div></div>'
			document.getElementById('smses').appendChild(div);
			selectEl.value="";
		   // Session.set(EDITING_KEY, null);
		   smsList.push(text);
        }
    },
    'submit #settings-form': function (event, template) {
        /**
         * Send Card Details
         * Get Card Token
         * Create New Stripe Customer
         *
         */
        event.preventDefault();
        var eValues = $('input[name="emails[]"]').map(function(){
            return this.value;
        }).get();
        var sValues = $('input[name="smses[]"]').map(function(){
            return this.value;
        }).get();
        if(!eValues&& !sValues){
            alert("Please Add Email Address or phone number")
        }else{
        var Settings = {
            //delay: "no_delay",
            name: $('input[name="name"]').val(),
            website: $('input[name="website"]').val(),
            phone: $('input[name="phone"]').val(),
            storeName: $('input[name="store-name"]').val(),
            emails: eValues,
            smses: sValues
        };
        console.log("Settings");
        console.log(Settings);

        //inEmail: $('input[name="in-bound-email"]').val()
        Meteor.call('updateSettings', Settings, function (error, response) {
            console.log(error);
            console.log(response);
            if (error) {
                swal({
                    title: "Error!",
                    text: "Something went wrong!",
                    type: "warning"
                });
            }
            else {
                swal({
                    title: "Success!",
                    text: "Profile updated successfully!",
                    type: "success"
                });
                Router.go('home');
            }
        });
        }
    }
});
function isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isNumberUS(phone_number) {
	var phone_number = phone_number.toString().replace( /\s+/g, "" );
  return phone_number.length > 9 &&	phone_number.match( /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/ );
}

function setEmailError(invalidMessage) {
 $("#newEmail").css("background-color", "#FF9494");
 $("#addEmail").attr('disabled','disabled');
 
 if(!document.getElementById("invalidMessage")) {	
   $("#newEmail").after( '<p type="text" class="form-control" id="invalidMessage" name="invalidMessage">' + invalidMessage + '</p>' );
 } else { 
	 $('#invalidMessage').text(invalidMessage);
 }
}

function setSmsError(invalidMessage) {
 $("#newSms").css("background-color", "#FF9494");
 $("#addSms").attr('disabled','disabled');
 
 if(!document.getElementById("invalidMessage")) {
   $("#newSms").after( '<p type="text" class="form-control" id="invalidMessage" name="invalidMessage">' + invalidMessage + '</p>' );
 } else {
	 $('#invalidMessage').text(invalidMessage);
 }
}

function removeEmailError() {
  $("#newEmail").css("background-color", "#FFFFFF");
  $("#addEmail").removeAttr("disabled");
  $("#invalidMessage").remove();
}

function removeSmsError() {
  $("#newSms").css("background-color", "#FFFFFF");
  $("#addSms").removeAttr("disabled");
  $("#invalidMessage").remove();
}

Template.profileSettings.rendered = function () {
    if(Meteor.user().profile.emails) {
		emailList = Meteor.user().profile.emails;
	}
	if(Meteor.user().profile.smses) {
		smsList = Meteor.user().profile.smses;
	}
    $("#settings-form").validate({
        rules: {
            delay: {
                required: true
            },
            "website": {
                required: true,
                url: true
            },
            "phone": {
                required: true,
                phoneUS: true
            },
            "emails[]": {
                required: true,
                email: true
            },
            "smses[]": {
                required: false,
                phoneUS: true
            },
            "newEmail": {
                required: true,
                email: true
            },
            "newSms": {
                required: true,
                phoneUS: true
            }
        },
         errorPlacement: function (error, element) {
        console.log(element)
        console.log(error)
        // error.insertBefore('.error_label');
        $(element).closest('div').next().find('.error_label').html(error);
        //$(element).closest('div').next().find('.error_label').html(error);
        },
        messages: {
            email: {
                required: "1st Email is required",
                email: "1st Invalid email"
            },
            phoneUS: {
                phoneUS: "1st Invalid phone number"
            }
        }
    });

};