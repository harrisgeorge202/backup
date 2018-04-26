var RATING_SYSTEM = 'ratingSystem', BASE_6 = 'base6', BASE_8 = 'base8', BASE_10 = 'base10';

Template.responseItem.onCreated(function () {
    console.log("Inside responseItem onCreated...");
});

Template.responseItem.onRendered(function () {
    // Nothing here
});

Template.responseItem.helpers({
    'ratingWithSign': function () {
        if (Session.get(RATING_SYSTEM) == BASE_8) {
            return (this.rating < 0 ? '' : '+') + this.rating;
        } else {
            return (this.rating);
        }
    },
    'ratingColor': function () {
        var ratingSystem = Session.get(RATING_SYSTEM);
        if (ratingSystem == BASE_6) {
            // If we want three color rating bubbles
            if (this.rating == 5) {
                return "#5cb85c";
            } else if (this.rating == 4) {
                return "#f0ad4e";
            } else {
                return "#d9534f";
            }
        } else if (ratingSystem == BASE_8) {
            // If we want two color rating bubbles
            if (this.rating < 0) {
                return "#d9534f";
            }
            return "#5cb85c";

            // If we want multicolor rating bubbles
            // switch (this.rating) {
            //     case -4: return "#e40500";
            //     case -3: return "#e3332e";
            //     case -2: return "#e05c59";
            //     case -1: return "#dd8a88";
            //     case 1: return "#87c37f";
            //     case 2: return "#6ac55e";
            //     case 3: return "#4fc640";
            //     case 4: return "#18c900";
            //     default: return "#83ccff";
            // }
        } else if (ratingSystem == BASE_10) {
            // If we want three color rating bubbles
            if (this.rating >= 9) {
                return "#5cb85c";
            } else if (this.rating >= 7) {
                return "#f0ad4e";
            } else {
                return "#d9534f";
            }
        }
    },
    'commentAvailable': function () {
        return this.comment;
    }
});

Template.responseItem.events({
    // Nothing here!
});
