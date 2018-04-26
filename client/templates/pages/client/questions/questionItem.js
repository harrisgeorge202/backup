/**
 * Created by baboon-soft on 17/12/15.
 */
var EDITING_KEY = 'EDITING_QUESTION_ID',
    EDITING_REMAINING = 'EDITING_REMAINING';

Template.questionItem.helpers({
    checkedClass: function() {
        return this.checked && 'checked';
    },
    editingClass: function() {
        return Session.equals(EDITING_KEY, this._id) && 'editing';
    }
});

Template.questionItem.events({
    'change [type=checkbox]': function(event) {
        var checked = $(event.target).is(':checked');
        Questions.update(this._id, {$set: {checked: checked}});
        Lists.update(this.listId, {$inc: {incompleteCount: checked ? -1 : 1}});
    },

    'focus input[type=text]': function(event) {
        Session.set(EDITING_KEY, this._id);
        Session.set(EDITING_REMAINING, (70 - event.target.value.length));
    },

    'blur input[type=text]': function(event) {
        if (Session.equals(EDITING_KEY, this._id))
            Session.set(EDITING_KEY, null);
    },

    'keydown input[type=text]': function(event) {
        // ESC or ENTER
        if (event.which === 27 || event.which === 13) {
            event.preventDefault();
            event.target.blur();
        }
    },

    // update the text of the item on keypress but throttle the event to ensure
    // we don't flood the server with updates (handles the event at most once 
    // every 300ms)
    'keyup input[type=text]': _.throttle(function(event) {
        if(!event.target.value){
            return;
        }
        Session.set(EDITING_REMAINING, (70 - event.target.value.length));
        if( this._id != "new")
        Meteor.call("updateQuestion", this._id, event.target.value);
    }, 1000),

    // handle mousedown otherwise the blur handler above will swallow the click
    // on iOS, we still require the click event so handle both
    'mousedown .js-delete-item, click .js-delete-item': function() {
        Meteor.call("deleteQuestion",this._id)
    },

    'mousedown .js-add-item, click .js-add-item': function() {
        Meteor.call("addQuestion",this._id)
    }
});