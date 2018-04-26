var LIST_HEADER_HEIGHT = 270; // offset distance for the list from the panel top
var NUMBER_TO_SHOW = 10; // number of responses to show each time.
var RATING_SYSTEM = 'ratingSystem', BASE_6 = 'base6', BASE_8 = 'base8', BASE_10 = 'base10';

Template.responseList.onCreated(function () {
    console.log("Inside responseList onCreated...");

    // Reactive variable to store corrent state of the filter button ('all', 'positive', 'negative')
    this.filterType = new ReactiveVar('all');

    // Reactive variable to indicate end of list
    this.noMore = new ReactiveVar(false);
    this.noMoreAll = new ReactiveVar(false);
    this.noMoreGood = new ReactiveVar(false);
    this.noMoreBad = new ReactiveVar(false);
    this.noMorePromoters = new ReactiveVar(false);
    this.noMorePassives = new ReactiveVar(false);
    this.noMoreDetractors = new ReactiveVar(false);

    // Reactive variables to store only selected response type and number and force rerender of list
    this.filteredAllResults = new ReactiveVar();
    this.filteredGoodResults = new ReactiveVar();
    this.filteredBadResults = new ReactiveVar();
    this.filteredPromotersResults = new ReactiveVar();
    this.filteredPassivesResults = new ReactiveVar();
    this.filteredDetractorsResults = new ReactiveVar();

    // Instance variables to store all responses from context
    this.data.responseData = Template.currentData().inputData;

    // Instance variables to store only selected response type and number
    this.data.allResponses = new Array();
    this.data.goodResponses = new Array();
    this.data.badResponses = new Array();
    this.data.promotersResponses = new Array();
    this.data.passivesResponses = new Array();
    this.data.detractorsResponses = new Array();

    // Instance variables to store current index for each response type
    this.data.allResponsesIndex = this.data.responseData.length - 1;;
    this.data.goodResponsesIndex = this.data.responseData.length - 1;;
    this.data.badResponsesIndex = this.data.responseData.length - 1;;
    this.data.promotersResponsesIndex = this.data.responseData.length - 1;;
    this.data.passivesResponsesIndex = this.data.responseData.length - 1;;
    this.data.detractorsResponsesIndex = this.data.responseData.length - 1;;

    // Preload first batch of rated responses.
    // All responses for BASE_6, BASE_8, and BASE_10
    var count = 0;
    while (this.data.allResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
        this.data.allResponses.push(this.data.responseData[this.data.allResponsesIndex]);
        count++;
        this.data.allResponsesIndex--;
    }

    var ratingSystem = Session.get(RATING_SYSTEM);

    // Good and Bad Responses if BASE_8
    if (ratingSystem == BASE_8) {
        count = 0;
        while (this.data.goodResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
            if (this.data.responseData[this.data.goodResponsesIndex].rating > 0) {
                this.data.goodResponses.push(this.data.responseData[this.data.goodResponsesIndex]);
                count++;
            }
            this.data.goodResponsesIndex--;
        }
        count = 0;
        while (this.data.badResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
            if (this.data.responseData[this.data.badResponsesIndex].rating < 0) {
                this.data.badResponses.push(this.data.responseData[this.data.badResponsesIndex]);
                count++;
            }
            this.data.badResponsesIndex--;
        }
    }
    // Promoters, Passives, and Detractors Responses if BASE_6
    else if (ratingSystem == BASE_6) {
        var ratingValue = 0;
        count = 0;
        while (this.data.promotersResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
            ratingValue = this.data.responseData[this.data.promotersResponsesIndex].rating;
            if (ratingValue == 5) {
                this.data.promotersResponses.push(this.data.responseData[this.data.promotersResponsesIndex]);
                count++;
            }
            this.data.promotersResponsesIndex--;
        }
        count = 0;
        while (this.data.passivesResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
            ratingValue = this.data.responseData[this.data.passivesResponsesIndex].rating;
            if (ratingValue == 4) {
                this.data.passivesResponses.push(this.data.responseData[this.data.passivesResponsesIndex]);
                count++;
            }
            this.data.passivesResponsesIndex--;
        }
        count = 0;
        while (this.data.detractorsResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
            ratingValue = this.data.responseData[this.data.detractorsResponsesIndex].rating;
            if (ratingValue >= 0 && ratingValue < 4) {
                this.data.detractorsResponses.push(this.data.responseData[this.data.detractorsResponsesIndex]);
                count++;
            }
            this.data.detractorsResponsesIndex--;
        }
    }
    // Promoters, Passives, and Detractors Responses if BASE_10
    else if (ratingSystem == BASE_10) {
        var ratingValue = 0;
        count = 0;
        while (this.data.promotersResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
            ratingValue = this.data.responseData[this.data.promotersResponsesIndex].rating;
            if (ratingValue >= 9) {
                this.data.promotersResponses.push(this.data.responseData[this.data.promotersResponsesIndex]);
                count++;
            }
            this.data.promotersResponsesIndex--;
        }
        count = 0;
        while (this.data.passivesResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
            ratingValue = this.data.responseData[this.data.passivesResponsesIndex].rating;
            if (ratingValue >= 7 && ratingValue < 9) {
                this.data.passivesResponses.push(this.data.responseData[this.data.passivesResponsesIndex]);
                count++;
            }
            this.data.passivesResponsesIndex--;
        }
        count = 0;
        while (this.data.detractorsResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
            ratingValue = this.data.responseData[this.data.detractorsResponsesIndex].rating;
            if (ratingValue >= 1 && ratingValue < 7) {
                this.data.detractorsResponses.push(this.data.responseData[this.data.detractorsResponsesIndex]);
                count++;
            }
            this.data.detractorsResponsesIndex--;
        }
    }

    if (ratingSystem == BASE_8) {
        // Store the first batch of rated responses.
        this.filteredAllResults.set(this.data.allResponses);
        this.filteredGoodResults.set(this.data.goodResponses);
        this.filteredBadResults.set(this.data.badResponses);

        // Update end of list index trackers if no more rated results available
        this.noMoreAll.set(this.data.allResponsesIndex < 0);
        this.noMoreGood.set(this.data.goodResponsesIndex < 0);
        this.noMoreBad.set(this.data.badResponsesIndex < 0);

        console.log("allResponses in responseList onCreated: ", this.data.allResponses);
        console.log("goodResponses in responseList onCreated: ", this.data.goodResponses);
        console.log("badResponses in responseList onCreated: ", this.data.badResponses);
    }
    else {
        // Store the first batch of rated responses.
        this.filteredAllResults.set(this.data.allResponses);
        this.filteredPromotersResults.set(this.data.promotersResponses);
        this.filteredPassivesResults.set(this.data.passivesResponses);
        this.filteredDetractorsResults.set(this.data.detractorsResponses);

        // Update end of list index trackers if no more rated results available
        this.noMoreAll.set(this.data.allResponsesIndex < 0);
        this.noMorePromoters.set(this.data.promotersResponsesIndex < 0);
        this.noMorePassives.set(this.data.passivesResponsesIndex < 0);
        this.noMoreDetractors.set(this.data.detractorsResponsesIndex < 0);

        console.log("allResponses in responseList onCreated: ", this.data.allResponses);
        console.log("promotersResponses in responseList onCreated: ", this.data.promotersResponses);
        console.log("passivesResponses in responseList onCreated: ", this.data.passivesResponses);
        console.log("detractorsResponses in responseList onCreated: ", this.data.detractorsResponses);
    }
});

Template.responseList.onRendered(function () {
    console.log("Inside responseList onRendered...");
    // Nothing here!
});

Template.responseList.helpers({
    'ratingSystemBase8': function() {
        return Session.get(RATING_SYSTEM) == BASE_8;
    },
    'panelHeight': function () {
        return Template.currentData().panelHeight - LIST_HEADER_HEIGHT;
    },
    'filterType': function () {
        return Template.instance().filterType.get();
    },
    'noMore': function () {
        var self = Template.instance();
        if (self.filterType.get() == 'all') {
            console.log("noMore = ", self.noMoreAll.get());
            return self.noMoreAll.get();
        }
        else if (self.filterType.get() == 'positive') {
            console.log("noMore = ", self.noMoreGood.get());
            return self.noMoreGood.get();
        }
        else if (self.filterType.get() == 'negative') {
            console.log("noMore = ", self.noMoreBad.get());
            return self.noMoreBad.get();
        }
        else if (self.filterType.get() == 'promoters') {
            console.log("noMore = ", self.noMorePromoters.get());
            return self.noMorePromoters.get();
        }
        else if (self.filterType.get() == 'passives') {
            console.log("noMore = ", self.noMorePassives.get());
            return self.noMorePassives.get();
        }
        else if (self.filterType.get() == 'detractors') {
            console.log("noMore = ", self.noMoreDetractors.get());
            return self.noMoreDetractors.get();
        }
    },
    'responseListData': function () {
        var self = Template.instance();
        if (self.filterType.get() == 'all') {
            console.log("responseListData, allResponses = ", this.allResponses);
            return self.filteredAllResults.get();
        }
        else if (self.filterType.get() == 'positive') {
            console.log("responseListData, goodResponses = ", this.goodResponses);
            return self.filteredGoodResults.get();
        }
        else if (self.filterType.get() == 'negative') {
            console.log("responseListData, badResponses = ", this.badResponses);
            return self.filteredBadResults.get();
        }
        else if (self.filterType.get() == 'promoters') {
            console.log("responseListData, promotersResponses = ", this.promotersResponses);
            return self.filteredPromotersResults.get();
        }
        else if (self.filterType.get() == 'passives') {
            console.log("responseListData, passivesResponses = ", this.passivesResponses);
            return self.filteredPassivesResults.get();
        }
        else if (self.filterType.get() == 'detractors') {
            console.log("responseListData, detractorsResponses = ", this.detractorsResponses);
            return self.filteredDetractorsResults.get();
        }
    }
});

Template.responseList.events({
    'click #all': function (event, template) {
        event.preventDefault();
        console.log("All filter button is clicked");
        template.filterType.set('all');
    },
    'click #good': function (event, template) {
        event.preventDefault();
        console.log("Positive filter button is clicked");
        template.filterType.set('positive');
    },
    'click #bad': function (event, template) {
        event.preventDefault();
        console.log("Negative filter button is clicked");
        template.filterType.set('negative');
    },
    'click #promoters': function (event, template) {
        event.preventDefault();
        console.log("Promoters filter button is clicked");
        template.filterType.set('promoters');
    },
    'click #passives': function (event, template) {
        event.preventDefault();
        console.log("Passives filter button is clicked");
        template.filterType.set('passives');
    },
    'click #detractors': function (event, template) {
        event.preventDefault();
        console.log("Detractors filter button is clicked");
        template.filterType.set('detractors');
    },
    'click #show-more': function (event, template) {
        event.preventDefault();
        console.log("Show More button is clicked");

        // Load next batch of rated responses.
        var ratingValue = 0;
        var count = 0;

        var ratingSystem = Session.get(RATING_SYSTEM);

        // Promoters, Passives, and Detractors Responses if base6
        if (ratingSystem == BASE_6) {
            if (template.filterType.get() == 'all') {
                while (template.data.allResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    template.data.allResponses.push(template.data.responseData[template.data.allResponsesIndex]);
                    count++;
                    template.data.allResponsesIndex--;
                }
                template.filteredAllResults.set(template.data.allResponses);
            }
            else if (template.filterType.get() == 'promoters') {
                while (template.data.promotersResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    ratingValue = template.data.responseData[template.data.promotersResponsesIndex].rating;
                    if (ratingValue == 5) {
                        template.data.promotersResponses.push(template.data.responseData[template.data.promotersResponsesIndex]);
                        count++;
                    }
                    template.data.promotersResponsesIndex--;
                }
                template.filteredPromotersResults.set(template.data.promotersResponses);
            }
            else if (template.filterType.get() == 'passives') {
                while (template.data.passivesResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    ratingValue = template.data.responseData[template.data.passivesResponsesIndex].rating;
                    if (ratingValue == 4) {
                        template.data.passivesResponses.push(template.data.responseData[template.data.passivesResponsesIndex]);
                        count++;
                    }
                    template.data.passivesResponsesIndex--;
                }
                template.filteredPassivesResults.set(template.data.passivesResponses);
            }
            else if (template.filterType.get() == 'detractors') {
                while (template.data.detractorsResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    ratingValue = template.data.responseData[template.data.detractorsResponsesIndex].rating;
                    if (ratingValue >= 0 && ratingValue < 4) {
                        template.data.detractorsResponses.push(template.data.responseData[template.data.detractorsResponsesIndex]);
                        count++;
                    }
                    template.data.detractorsResponsesIndex--;
                }
                template.filteredDetractorsResults.set(template.data.detractorsResponses);
            }

            // Update end of list index trackers if no more rated results available
            template.noMoreAll.set(template.data.allResponsesIndex < 0);
            template.noMorePromoters.set(template.data.promotersResponsesIndex < 0);
            template.noMorePassives.set(template.data.passivesResponsesIndex < 0);
            template.noMoreDetractors.set(template.data.detractorsResponsesIndex < 0);

            console.log("allResponses in showMore click: ", template.data.allResponses);
            console.log("promotersResponses in showMore click: ", template.data.promotersResponses);
            console.log("passivesResponses in showMore click: ", template.data.passivesResponses);
            console.log("detractorsResponses in showMore click: ", template.data.detractorsResponses);
        }
        // All, Good and Bad Responses if base8
        else if (ratingSystem == BASE_8) {
            if (template.filterType.get() == 'all') {
                while (template.data.allResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    template.data.allResponses.push(template.data.responseData[template.data.allResponsesIndex]);
                    count++;
                    template.data.allResponsesIndex--;
                }
                template.filteredAllResults.set(template.data.allResponses);
            }
            else if (template.filterType.get() == 'positive') {
                while (template.data.goodResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    if (template.data.responseData[template.data.goodResponsesIndex].rating > 0) {
                        template.data.goodResponses.push(template.data.responseData[template.data.goodResponsesIndex]);
                        count++;
                    }
                    template.data.goodResponsesIndex--;
                }
                template.filteredGoodResults.set(template.data.goodResponses);
            }
            else if (template.filterType.get() == 'negative') {
                while (template.data.badResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    if (template.data.responseData[template.data.badResponsesIndex].rating < 0) {
                        template.data.badResponses.push(template.data.responseData[template.data.badResponsesIndex]);
                        count++;
                    }
                    template.data.badResponsesIndex--;
                }
                template.filteredBadResults.set(template.data.badResponses);
            }

            // Update end of list index trackers if no more rated results available
            template.noMoreAll.set(template.data.allResponsesIndex < 0);
            template.noMoreGood.set(template.data.goodResponsesIndex < 0);
            template.noMoreBad.set(template.data.badResponsesIndex < 0);

            console.log("allResponses in showMore click: ", template.data.allResponses);
            console.log("goodResponses in showMore click: ", template.data.goodResponses);
            console.log("badResponses in showMore click: ", template.data.badResponses);
        }
        // Promoters, Passives, and Detractors Responses if base10
        else if (ratingSystem == BASE_10) {
            if (template.filterType.get() == 'all') {
                while (template.data.allResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    template.data.allResponses.push(template.data.responseData[template.data.allResponsesIndex]);
                    count++;
                    template.data.allResponsesIndex--;
                }
                template.filteredAllResults.set(template.data.allResponses);
            }
            else if (template.filterType.get() == 'promoters') {
                while (template.data.promotersResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    ratingValue = template.data.responseData[template.data.promotersResponsesIndex].rating;
                    if (ratingValue >= 9) {
                        template.data.promotersResponses.push(template.data.responseData[template.data.promotersResponsesIndex]);
                        count++;
                    }
                    template.data.promotersResponsesIndex--;
                }
                template.filteredPromotersResults.set(template.data.promotersResponses);
            }
            else if (template.filterType.get() == 'passives') {
                while (template.data.passivesResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    ratingValue = template.data.responseData[template.data.passivesResponsesIndex].rating;
                    if (ratingValue >= 7 && ratingValue < 9) {
                        template.data.passivesResponses.push(template.data.responseData[template.data.passivesResponsesIndex]);
                        count++;
                    }
                    template.data.passivesResponsesIndex--;
                }
                template.filteredPassivesResults.set(template.data.passivesResponses);
            }
            else if (template.filterType.get() == 'detractors') {
                while (template.data.detractorsResponsesIndex >= 0 && count < NUMBER_TO_SHOW) {
                    ratingValue = template.data.responseData[template.data.detractorsResponsesIndex].rating;
                    if (ratingValue >= 1 && ratingValue < 7) {
                        template.data.detractorsResponses.push(template.data.responseData[template.data.detractorsResponsesIndex]);
                        count++;
                    }
                    template.data.detractorsResponsesIndex--;
                }
                template.filteredDetractorsResults.set(template.data.detractorsResponses);
            }

            // Update end of list index trackers if no more rated results available
            template.noMoreAll.set(template.data.allResponsesIndex < 0);
            template.noMorePromoters.set(template.data.promotersResponsesIndex < 0);
            template.noMorePassives.set(template.data.passivesResponsesIndex < 0);
            template.noMoreDetractors.set(template.data.detractorsResponsesIndex < 0);

            console.log("allResponses in showMore click: ", template.data.allResponses);
            console.log("promotersResponses in showMore click: ", template.data.promotersResponses);
            console.log("passivesResponses in showMore click: ", template.data.passivesResponses);
            console.log("detractorsResponses in showMore click: ", template.data.detractorsResponses);
        }
    }
});
