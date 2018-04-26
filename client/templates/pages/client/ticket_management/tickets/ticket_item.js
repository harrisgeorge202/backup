Template.ticketItem.helpers({
    ticketStatusClass: function () {
        var ticket = Tickets.findOne(this._id);

        // in future, valuew will be stored in session for users to change
        var orangeStatus = 30;
        var redStatus = 60;

        var now = new Date();
        var ticketDate = ticket.created;
        var difference = now - ticketDate;
        var diffMinutes = Math.floor((difference / 1000 / 60));

        if (ticket.status === 'resolved') {
            return 'status-green';
        } else if (diffMinutes >= redStatus) {
            return 'status-red';
        } else if (diffMinutes >= orangeStatus) {
            return 'status-orange';
        } else if (diffMinutes >= 0) {
            return 'status-yellow';
        }
    },
    isActive: function () {
        return Session.equals('selectedTicket', this._id) ? 'ticket-active' : '';
    }
});

Template.ticketItem.events({
    "click": function () {
        Session.set('selectedTicket', this._id);
    }
})