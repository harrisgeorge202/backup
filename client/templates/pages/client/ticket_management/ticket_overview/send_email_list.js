Template.sendEmailList.helpers({
    comments1: function () {
        return Ticketemailcomments.find({ticketId: this._id});
    }
});
