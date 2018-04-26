Template.commentsList.helpers({
    comments: function () {
        return Comments.find({ticketId: this._id});
    }
});