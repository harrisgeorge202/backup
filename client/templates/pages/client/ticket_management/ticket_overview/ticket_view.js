Template.ticketView.helpers({
    isResolved: function () {
        var ticket = Tickets.findOne(Router.current().params._id);
        return ticket.status === 'resolved' ? false : true;
    }
});







// Template.ticketView.events({
  
//        'click #checkbox1': function (event, template) {
//         var smsStatus = template.$('[name=smsNotification]').is(":checked");
//         var emailStatus = template.$('[name=emailNotification]').is(":checked");
//         var status = smsStatus || emailStatus;
//         var data;
//         console.log(status)
//         if (status) {
//             $('#show').show();
//         } else {
//             $('#show').hide();
//         }
//     },

//     'click #checkbox2': function (event, template) {
//         var smsStatus = template.$('[name=smsNotification]').is(":checked");
//         var emailStatus = template.$('[name=emailNotification]').is(":checked");
//         var status = smsStatus || emailStatus;
//         var data;
//         console.log(status)
//         if (status) {
//             $('#show2').show();
//         } else {
//             $('#show2').hide();
//         }
//     },

// });
