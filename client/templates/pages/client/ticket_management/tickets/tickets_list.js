Template.ticketsList.onCreated(function () {
    // Sorting
    this.ratingSort = new ReactiveVar();
    this.ratingSort.set(1);

    this.createdSort = new ReactiveVar();
    this.createdSort.set(0);

    this.lastSort = new ReactiveVar();
    // this.lastSort.set('Rating Asc');
    this.lastSort.set('Time Desc');

    // Tabs
    this.currentTab = new ReactiveVar();
    this.currentTab.set('unresolved');
});


Template.ticketsList.helpers({

    tickets: function () {
        var tab = Template.instance().currentTab.get();
        var lastSort = Template.instance().lastSort.get();

        if (lastSort.includes('Rating')) {
            return Tickets.find({
                status: tab
            }, {
                sort: {
                    rating: Template.instance().ratingSort.get(),
                    created: Template.instance().createdSort.get()
                }
            });
        }
        if (lastSort.includes('Time')) {
            return Tickets.find({
            status: tab
        }, {
            sort: {
                created: Template.instance().createdSort.get(),
                rating: Template.instance().ratingSort.get()
            }
        });
        }

    },
    unresolvedTicketsCount: function () {
        return Tickets.find({
            status: 'unresolved'
        }).count();
    },
    unresolvedActive: function () {
        if (Template.instance().currentTab.get() === 'unresolved') {
            return 'active tab-active';
        } else {
            return '';
        }
    },
    resolvedActive: function () {
        if (Template.instance().currentTab.get() === 'resolved') {
            return 'active tab-active';
        } else {
            return '';
        }
    },
    currentSort: function () {
        return Template.instance().lastSort.get();

    }
});
// Filtering and Sorting
Template.ticketsList.events({
    // Tabs
    "click #unresolved": function () {
        Template.instance().currentTab.set('unresolved');
    },
    "click #resolved": function () {
        Template.instance().currentTab.set('resolved');
    },
    // Sorting
    "click #rating-desc": function (event, template) {
        template.ratingSort.set(-1);
        template.createdSort.set(0);
        template.lastSort.set('Rating Desc');
    },
    "click #rating-asc": function (event, template) {
        template.ratingSort.set(1);
        template.createdSort.set(0);
        template.lastSort.set('Rating Asc');
    },
    "click #time-desc": function (event, template) {
        template.createdSort.set(-1);
        template.ratingSort.set(0);
        template.lastSort.set('Time Desc');
    },
    "click #time-asc": function (event, template) {
        template.createdSort.set(1);
        template.ratingSort.set(0);
        template.lastSort.set('Time Asc');
    }
});
