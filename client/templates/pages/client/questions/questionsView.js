/**
 * Created by baboon-soft on 17/12/15.
 */

var EDITING_KEY = 'EDITING_QUESTION_ID',
    EDITING_REMAINING = 'EDITING_REMAINING';

Template.questionsView.onCreated(function () {
    if (!Session.get("limit")) {
        Session.set("limit", 3);
    }
    Session.set('PREVIEW', true);
    Session.set('ratingtab', 1);
});
Template.questionsView.onRendered(function () {
    //console.log("questionsView onRendered");
    //console.log($('#session-comment'));
    //var el = this.find( '#session-comment' );
    //console.log(el);
    $('#session-header-font-reset').hide();
    $('#session-header-top-color-reset').hide();
    $('#session-header-bottom-color-reset').hide();
    $('#session-header-logo-reset').hide();
    $('#session-header-top-sbanner-reset').hide();
    $('#session-header-bottom-sbanner-reset').hide();
    $('#session-header-top-tbanner-reset').hide();
    $('#session-header-bottom-tbanner-reset').hide();

    $('#session-rating-color-reset').hide();
});
Template.questionsView.onDestroyed(function () {
    //console.log("questionsView onRendered");
    //console.log($('#session-comment'));
    //var el = this.find( '#session-comment' );
    //console.log(el);
    delete Session.keys['logo']
    delete Session.keys['surveyTopBanner']
    delete Session.keys['surveyBottomBanner']
    delete Session.keys['thankyouTopBanner']
    delete Session.keys['thankyouBottomBanner']
    delete Session.keys['SESSION_HEADER_FONT']
    delete Session.keys['SESSION_TOP']
    delete Session.keys['SESSION_BOTTOM']
    delete Session.keys['SESSION_DEFAULTCMNT']
    delete Session.keys['SESSION_CMNT1']
    delete Session.keys['SESSION_CMNT2']
    delete Session.keys['SESSION_CMNT3']
    delete Session.keys['BASE6_SESSION_CMNT1']
    delete Session.keys['BASE6_SESSION_CMNT2']
    delete Session.keys['SESSION_MSG']
    delete Session.keys['SESSION_RATING_COLOR']
    
    
    
});

Template.questionsView.rendered = function () {
    //console.log("questionsView rendered");
    //console.log($('#session-comment'));

    //making sure editor get initialized
    setTimeout(function () {
        $('#session-defaultcomment').summernote({
            placeholder: "Whatever you write here will be shown to your customers after they give feedback! Some examples are discount codes, coupons, or messages. You can put whatever you feel works best for your business, or even leave it blank.",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('SESSION_DEFAULTCMNT', contents);
                }
            }
        });
        $('#session-comment1').summernote({
            placeholder: "Whatever you write here will be shown to your customers after they give feedback! Some examples are discount codes, coupons, or messages. You can put whatever you feel works best for your business, or even leave it blank.",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('SESSION_CMNT1', contents);
                }
            }
        });
        $('#base6_session-comment1').summernote({
            placeholder: "Whatever you write here will be shown to your customers after they give feedback! Some examples are discount codes, coupons, or messages. You can put whatever you feel works best for your business, or even leave it blank.",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('BASE6_SESSION_CMNT1', contents);
                }
            }
        });
        $('#session-message').summernote({
            placeholder: "Whatever you write here will be included in emails as a promotional message, give them a good offer!",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('SESSION_MSG', contents);
                }
            }
        });
        // Initiate color picker to select header color
        $('#session-header-font').colorpicker().on('changeColor', function(e) {

            $('#session-header-font-reset').show();

            Session.set('SESSION_HEADER_FONT',e.color.toHex())

        });

        $('#session-top').colorpicker().on('changeColor', function(e) {
            $('#session-header-top-color-reset').show();
            Session.set('SESSION_TOP',e.color.toHex())
        });

        $('#session-bottom').colorpicker().on('changeColor', function(e) {
            $('#session-header-bottom-color-reset').show();
            Session.set('SESSION_BOTTOM',e.color.toHex())
        });
         $('#session-rating-color').colorpicker().on('changeColor', function(e) {
            $('#session-rating-color-reset').show();
            Session.set('SESSION_RATING_COLOR',e.color.toHex())
        });

        $(".rotate").textrotator({
            animation: "spin", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
            separator: ",",
            speed: 3000 // How many milliseconds until the next word show.
        });

    }, 1000); 


};

Template.questionsView.helpers({

    landingpagecomments: function(scaleType){
        var userSettings=Meteor.user().settings;
        if(userSettings.scaleType==scaleType){
            console.log(userSettings.dynamicPageLanding)
            return userSettings.dynamicPageLanding;
        }else{
            return false;
        }
    },
    scaletype: function(scaleType){
        console.log("scaleType ",scaleType)
        var userSettings=Meteor.user().settings;
        if(userSettings.scaleType && userSettings.scaleType==scaleType)
        {
            return true;
        }else{
            return false;
        }
    },
    delay: function () {
        return DELAY;
    },
    testCheck: function (a) {
        //console.log(a);
        //console.log(this);
        //console.log(Meteor.user());
        if (this.name === a) {
            return "checked";
        }
    },
    ratingtab1:function(){
         var v=Session.get('ratingtab');
         if(v==1){
             return true
         }else{
             return false
         }
    },
    ratingtab2:function(){
         var v=Session.get('ratingtab');
         if(v==2){
             return true
         }else{
             return false
         }
    },
    ratingtab3:function(){
         var v=Session.get('ratingtab');
         if(v==3){
             return true
         }else{
             return false
         }
    },
    first_tab: function(){
        console.log("in first stab");
        return Session.get('PREVIEW');
    },
    sessions: function () {
        console.log(this._id);
        return Sessions.find();
    },
    session_delay: function () {
        //console.log("Sessions.findOne()");
        //console.log(Sessions.findOne());

        return Sessions.findOne().platform_delay;
    },
    sessionReady: function () {
        return Router.current().sessionHandle.ready();
    },
    maxQuestion: function () {
        /*var N = 3;
         return Array.apply(null, {length: N}).map(Number.call, Number);*/
        return [{value: 1}, {value: 2}, {value: 3}];
    },
    userSelected: function () {
        if (this.value == Session.get("limit")) {
            return "selected";
        }
    },
    questionsReady: function () {
        return Router.current().questionsHandle.ready();
    },
    editingOne: function () {
        return !!Session.get(EDITING_KEY);
    },
    /*questions: function () {
     return Questions.find();
     },*/
    strikeQuestions: function () {
        var Qs = Questions.find().fetch(),
            limit = Session.get('limit');
        for (var i = 0; i < Qs.length; i++) {
            if (limit > i) {
                Qs[i].strike = true;
            }
            else {
                Qs[i].strike = false;
            }
        }
        return Qs;
    },
    additional: function () {
        var Qs = Questions.find().fetch(),
            limit = Session.get('limit');
        return (Qs.length < limit);
    },
    remainingLetters: function () {
        return Session.get(EDITING_REMAINING);
    },
    rotater: function(){
        console.log(this);
        var Qs = Questions.find().fetch(),
            limit = Session.get('limit'),
            loopLimit = 0,
            rotater = "";

        if(Qs.length === 0){
            console.info('returned ""');
            return "";
        }

        if (limit > 0) {
            rotater = Qs[0].text;
        }

        loopLimit = (limit < Qs.length) ? limit : Qs.length;
        for (var i = 1; i < loopLimit; i++) {
            rotater = rotater + ", " + Qs[i].text;
        }

        if(isNaN(limit)){
            rotater = "";
        }

        console.info('NOT returned "'+rotater+'"');

       return rotater;
    },

    ratingColor:function(){
            return Sessions.findOne().rating_color;
    },
    //For Reset Button
    fontcolor:function(){
        return Sessions.findOne().header_font_color;
    },
    topcolor:function(){
        return Sessions.findOne().top_color;
    },
    bottomcolor:function(){
        return Sessions.findOne().bottom_color;
    },
    logofind:function(){
        return Sessions.findOne().logo;
    },
    surveytopbanner:function(){
        return Sessions.findOne().surveyTopBanner;
    },
    surveybottombanner:function(){
        return Sessions.findOne().surveyBottomBanner;
    },
    thankyoutopbanner:function(){
        return Sessions.findOne().thankyouTopBanner;
    },
    thankyoubottombanner:function(){
        return Sessions.findOne().thankyouBottomBanner;
    },



    commenter: function(){
        return Session.get("SESSION_MSG") || Sessions.findOne().platform_message;
    },
    thanks_defaultcmnt: function(){
        return Session.get('SESSION_DEFAULTCMNT')||Sessions.findOne().defaultComment;
    },
    thanks_cmnt1: function(){
        return Session.get('SESSION_CMNT1')||Sessions.findOne().comment1;
    },
    thanks_cmnt2: function(){
        return Session.get('SESSION_CMNT2')||Sessions.findOne().comment2;
    },
    thanks_cmnt3: function(){
        return Session.get('SESSION_CMNT3')||Sessions.findOne().comment3;
    },
    base6_thanks_cmnt1: function(){
        return Session.get('BASE6_SESSION_CMNT1')||Sessions.findOne().base6_comment1;
    },
    base6_thanks_cmnt2: function(){
        return Session.get('BASE6_SESSION_CMNT2')||Sessions.findOne().base6_comment2;
    },
    header_font_color: function(){
        return Session.get('SESSION_HEADER_FONT') || Sessions.findOne().header_font_color || "#fff";
    },

    top_color: function(){
        return Session.get('SESSION_TOP') || Sessions.findOne().top_color || "#3498db";
    },
    bottom_color: function(){
        return Session.get('SESSION_BOTTOM') || Sessions.findOne().bottom_color || "#3498db";
    },

    logo : function(){
        return Session.get('logo') || Sessions.findOne().logo || "";
    },
    surveyTopBanner : function() {
        return Session.get('surveyTopBanner')||Sessions.findOne().surveyTopBanner|| "";
    },
    thankyouTopBanner : function() {
        return Session.get('thankyouTopBanner') || Sessions.findOne().thankyouTopBanner|| "";
    },
    surveyBottomBanner : function() {
        return Session.get('surveyBottomBanner') || Sessions.findOne().surveyBottomBanner|| "";
    },
    thankyouBottomBanner : function() {
        return Session.get('thankyouBottomBanner') || Sessions.findOne().thankyouBottomBanner|| "";
    },
     ratingcolor : function() {
        return Session.get('SESSION_RATING_COLOR') || Sessions.findOne().rating_color|| "#000";
    },
    subject : function() {
        return Sessions.findOne().email_subject|| "";
    },
    myCallbacks: function() {
        
        // Get data back after uploading image
        return {
            formData: function() {
                var data = Sessions.findOne()
                if(data) {
                    return {
                        _id : data._id
                    }
                } 
            },
            finished: function(index, fileInfo, context) {
                // $('#session-header-logo-reset').show();
                var image = {url:fileInfo.baseUrl+fileInfo.name}
                console.log(image)
                Session.set('logo',image.url)
            }
        }
    },
    mySurveyTopBannerCallback:function() {
        
        // Get data back after uploading image
        return {
            formData: function() {
                var data = Sessions.findOne()
                if(data) {
                    return {
                        _id : data._id
                    }
                } 
            },
            finished: function(index, fileInfo, context) {
                // $('#session-header-top-sbanner-reset').show();
                var image = {url:fileInfo.baseUrl+fileInfo.name}
                console.log(image)
                Session.set('surveyTopBanner',image.url)
            }
        }
    },    


    mySurveyBottomBannerCallback:function() {
        
        // Get data back after uploading image
        return {
            formData: function() {
                var data = Sessions.findOne()
                if(data) {
                    return {
                        _id : data._id
                    }
                } 
            },
            finished: function(index, fileInfo, context) {
                // $('#session-header-bottom-sbanner-reset').show();
                var image = {url:fileInfo.baseUrl+fileInfo.name}
                console.log(image)
                Session.set('surveyBottomBanner',image.url)
            }
        }
    },    


    myThankyouTopBannerCallback:function() {
        
        // Get data back after uploading image
        return {
            formData: function() {
                var data = Sessions.findOne()
                if(data) {
                    return {
                        _id : data._id
                    }
                } 
            },
            finished: function(index, fileInfo, context) {
                // $('#session-header-top-tbanner-reset').show();
                var image = {url:fileInfo.baseUrl+fileInfo.name}
                console.log(image)
                Session.set('thankyouTopBanner',image.url)
            }
        }
    },    


    myThankyouBottomBannerCallback:function() {
        
        // Get data back after uploading image
        return {
            formData: function() {
                var data = Sessions.findOne()
                if(data) {
                    return {
                        _id : data._id
                    }
                } 
            },
            finished: function(index, fileInfo, context) {
                // $('#session-header-bottom-tbanner-reset').show();
                var image = {url:fileInfo.baseUrl+fileInfo.name}
                console.log(image)
                Session.set('thankyouBottomBanner',image.url)
            }
        }
    },    




    userDetails : function() {
        return Meteor.users.find({_id: Meteor.userId()},{fields:{settings:1 }}).fetch()[0]
    }
});

Template.questionsView.events({



'click #session-rating-color-reset' : function(event) {
        console.log("In Font reset")
        // var color=Sessions.findOne().header_font_color;
         Meteor.call("reset",this._id,'rating_color',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-rating-color-reset').hide();

                    //$("#session-header-font-reset").css({"background-color": "#FFF"});
                    //$("#header1").css({"color": "#FFF"});
                    //delete Session.keys['SESSION_RATING_CIRCLE'];
                    //Session.set('SESSION_RATING_COLOR', "#000");
                    delete Session.keys['SESSION_HEADER_FONT'];
                    console.log("Rating cirlce color Reseted")
                }
            });
    },





    'click #session-header-font-reset' : function(event) {
        console.log("In Font reset")
        // var color=Sessions.findOne().header_font_color;
         Meteor.call("reset",this._id,'header_font_color',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-header-font-reset').hide();
                    //$("#session-header-font-reset").css({"background-color": "#FFF"});
                    $("#header1").css({"color": "#FFF"});
                    delete Session.keys['SESSION_HEADER_FONT'];


                    console.log("Font color Reseted")
                }
            });
    },

    'click #session-header-top-color-reset' : function(event) {
        // $('#session-header-top-color-reset').hide();
        Meteor.call("reset",this._id,'top_color',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-header-top-color-reset').hide();
                    $('#header1').css({"background-color": "#3498db"});
                    delete Session.keys['SESSION_TOP'];
                    console.log("top color Reseted")
                }
            });


       /* var color=Sessions.findOne().top_color;
        console.log("In Top color reset")
        if(color){
        Session.set('SESSION_TOP',color)
        }else{
        Session.set('SESSION_TOP',"#3498db")
        }*/
    },

    'click #session-header-bottom-color-reset' : function(event) {
        // $('#session-header-bottom-color-reset').hide();
        // var color=Sessions.findOne().bottom_color;

         Meteor.call("reset",this._id,'bottom_color',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-header-bottom-color-reset').hide();
                    $('#header2').css({"background-color": "#3498db"});
                    delete Session.keys['SESSION_BOTTOM'];
                    console.log("bottom color Reseted")
                }
            });
        /*console.log("In bottom color reset")
        console.log(color)
        if(color){
        Session.set('SESSION_BOTTOM',color)
        }else{
        Session.set('SESSION_BOTTOM',"#3498db")  
        }*/
    },

    'click #session-header-logo-reset' : function(event) {
        // $('#session-header-logo-reset').hide();
        console.log("In logo reset")
         // var img=Sessions.findOne().logo;
         Meteor.call("reset",this._id,'logo',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-header-logo-reset').hide();
                    delete Session.keys['logo'];                 
                    console.log("Logo Reseted")
                }
            });

        /*if(img){
        Session.set('logo',img)
        }else{
        Session.set('logo',undefined)
        }*/
    },


    'click #session-header-top-sbanner-reset' : function(event) {
        // $('#session-header-top-sbanner-reset').hide();
        console.log("In survey top banner reset")
        // var img=Sessions.findOne().surveyTopBanner;
         Meteor.call("reset",this._id,'surveyTopBanner',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-header-top-sbanner-reset').hide();
                    //$('#header1').css({"background-color": "#3498db"});
                    delete Session.keys['surveyTopBanner'];
                    delete Session.keys['SESSION_TOP'];
                    console.log("Survey top banner Reseted")
                }
            });

        /*if(img){
        Session.set('surveyTopBanner',img)
        }else{
        Session.set('surveyTopBanner',undefined)
        }*/
    },


    'click #session-header-bottom-sbanner-reset' : function(event) {
         // $('#session-header-bottom-sbanner-reset').hide();
        console.log("In survey bottom banner reset")
         // var img=Sessions.findOne().surveyBottomBanner;
         Meteor.call("reset",this._id,'surveyBottomBanner',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-header-bottom-sbanner-reset').hide();
                    //$('#header2').css({"background-color": "#3498db"});
                    delete Session.keys['surveyBottomBanner'];
                    delete Session.keys['SESSION_BOTTOM'];
                    console.log("survey bottom Reseted")
                }
            });

        /*if(img){
        Session.set('surveyBottomBanner',img)
        }else{
        Session.set('surveyBottomBanner',undefined)
        }*/
        
    },
     'click #session-header-top-tbanner-reset' : function(event) {
         // $('#session-header-top-tbanner-reset').hide();
        console.log("In thankyou top banner reset")
         // var img=Sessions.findOne().thankyouTopBanner;
         Meteor.call("reset",this._id,'thankyouTopBanner',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-header-top-tbanner-reset').hide();
                    //$('#header1').css({"background-color": "#3498db"});
                    delete Session.keys['thankyouTopBanner'];
                    delete Session.keys['SESSION_TOP'];
                    console.log("thankyou top banner Reseted")
                }
            });
        /*if(img){
        Session.set('thankyouTopBanner',img)
        }else{
        Session.set('thankyouTopBanner',undefined)
        }*/
        
    },
     'click #session-header-bottom-tbanner-reset' : function(event) {
         // $('#session-header-bottom-tbanner-reset').hide();
        console.log("In thankyou bottom banner reset")
         // var img=Sessions.findOne().thankyouBottomBanner;
         Meteor.call("reset",this._id,'thankyouBottomBanner',function(err,res){
                if(err){
                    console.log(err)
                }else{
                    $('#session-header-bottom-tbanner-reset').hide();
                    //$('#header2').css({"background-color": "#3498db"});
                    delete Session.keys['SESSION_BOTTOM'];
                    delete Session.keys['thankyouBottomBanner'];
                    console.log("thankyou bottom banner Reseted")
                }
            });
        /*if(img){
        Session.set('thankyouBottomBanner',img)
        }else{
        Session.set('thankyouBottomBanner',undefined)
        }*/
        
    },


    'click #survey-preview' : function(event) {
        console.info("setting true");
        Session.set('PREVIEW', true);
        setTimeout(function () {
            $(".rotate").textrotator({
                animation: "spin", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
                separator: ",",
                speed: 3000 // How many milliseconds until the next word show.
            });
        },1000);
    },
    'click #thank-preview' : function(event) {
        console.info("setting false");
        Session.set('PREVIEW', false);
        setTimeout(function () {
            $(".rotate").textrotator({
                animation: "spin", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
                separator: ",",
                speed: 3000 // How many milliseconds until the next word show.
            });
        },1000);
    },
    'click #preview1-6' : function(event) {
        console.info("1-6 rating");
        Session.set('ratingtab', 1);
        setTimeout(function () {
        $('#session-comment1').summernote({
            placeholder: "Whatever you write here will be shown to your customers after they give feedback! Some examples are discount codes, coupons, or messages. You can put whatever you feel works best for your business, or even leave it blank.",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('SESSION_CMNT1', contents);
                }
            }
        });
        });
    },
    'click #preview7-8' : function(event) {
        console.info("7-8 rating");
        Session.set('ratingtab', 2);
         setTimeout(function () {
        $('#session-comment2').summernote({
            placeholder: "Whatever you write here will be shown to your customers after they give feedback! Some examples are discount codes, coupons, or messages. You can put whatever you feel works best for your business, or even leave it blank.",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('SESSION_CMNT2', contents);
                }
            }
        });
         });
    },
    'click #preview9-10' : function(event) {
        console.info("9-10 rating");
        Session.set('ratingtab', 3);
         setTimeout(function () {
        $('#session-comment3').summernote({
            placeholder: "Whatever you write here will be shown to your customers after they give feedback! Some examples are discount codes, coupons, or messages. You can put whatever you feel works best for your business, or even leave it blank.",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('SESSION_CMNT3', contents);
                }
            }
        });
         });
    },
    /*
    *   Base 6 scale type
    */
    'click #preview0-3' : function(event) {
        console.info("0-3 rating");
        Session.set('ratingtab', 1);
         setTimeout(function () {
        $('#base6_session-comment1').summernote({
            placeholder: "Whatever you write here will be shown to your customers after they give feedback! Some examples are discount codes, coupons, or messages. You can put whatever you feel works best for your business, or even leave it blank.",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('BASE6_SESSION_CMNT1', contents);
                }
            }
        });
         });
    },

    'click #preview4-5' : function(event) {
        console.info("4-5 rating");
        Session.set('ratingtab', 2);
         setTimeout(function () {
        $('#base6_session-comment2').summernote({
            placeholder: "Whatever you write here will be shown to your customers after they give feedback! Some examples are discount codes, coupons, or messages. You can put whatever you feel works best for your business, or even leave it blank.",
           /* toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]*/
             toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
            callbacks: {
                onChange: function(contents, $editable) {
                    Session.set('BASE6_SESSION_CMNT2', contents);
                }
            }
        });
         });
    },

    ////////////////////////

    'focus .question-body': function (event) {
        Session.set(EDITING_KEY, 'new');
        Session.set(EDITING_REMAINING, (70 - event.target.value.length));
    },
    'blur .question-body': function (event) {
        if (Session.equals(EDITING_KEY, 'new'))
            Session.set(EDITING_KEY, null);
    },
    'keyup .question-body': function (event) {
        Session.set(EDITING_REMAINING, (70 - event.target.value.length));
    },
    'change select': function (event) {
        var checked = Number($(event.target).val());
        Session.set('limit', checked);
    },


    // 'change session-comment1': function (event) {
    //     var checked = Number($(event.target).val());
    //     Session.set('limit', checked);
    // },
    // 'change session-comment2': function (event) {
    //     var checked = Number($(event.target).val());
    //     Session.set('limit', checked);
    // },
    // 'change session-comment3': function (event) {
    //     var checked = Number($(event.target).val());
    //     Session.set('limit', checked);
    // },


    "submit .new-task": function (event) {
        // Prevent default browser form submit
        event.preventDefault();
        var template = Template.instance();
        var selectEl = template.find("#newQuestion");
        var text = selectEl.value;
        // Insert new question into the collection
        if (text)
            Meteor.call("addQuestion", this._id, text);
        // Clear form
        selectEl.value = "";
        Session.set(EDITING_KEY, null);
    },
    "submit .session-platform": function (event) {
        // Function to convert rgd to hex color
        function colorToHex(color) {
            if (color.substr(0, 1) === '#') {
                return color;
            }
            var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
            console.log(digits)
            if(digits)
            {
                var r = parseInt(digits[2]);
                var g = parseInt(digits[3]);
                var b = parseInt(digits[4]);
                return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            }
        };
        // Prevent default browser form submit
        event.preventDefault();
        var template    = Template.instance();
        // var ratingtext1        = $('#session-comment1').val();
        // var ratingtext2        = $('#session-comment2').val();
        // var ratingtext3        = $('#session-comment3').val();

        var inputEl2    = template.find("#session-message");
        var text2       = inputEl2.value;
        var inputEl3    = template.find("#session-subject");
        var email_subject = "How did we do?";
        if (inputEl3) {
            email_subject       = inputEl3.value;
        }
         var defaultratingtext        = $('#session-defaultcomment').val();

        var inputEl4    = template.find("#session-senderName");
        if(inputEl4)
            var text3       = inputEl4.value;

        var platform_delay = $('input[name="delay"]:checked').val();
        // var headerColor    = $('#header1')[0].style.color;

        // var topColor    = $('#header1')[0].style.backgroundColor;
        // var bottomColor    = $('#header2')[0].style.backgroundColor;

        // var headerColorHex  = colorToHex(headerColor);

        // var topColorHex  = colorToHex(topColor);
        // var bottomColorHex  = colorToHex(bottomColor);
        var logo ;
        Session.set(EDITING_KEY, null);


        if (Session.get('SESSION_CMNT1')) {
            ratingtext1 = Session.get('SESSION_CMNT1')
        } else {
            ratingtext1 = Sessions.findOne().comment1
        }
        if (Session.get('SESSION_CMNT2')) {
            ratingtext2 = Session.get('SESSION_CMNT2')
        } else {
            ratingtext2 = Sessions.findOne().comment2
        }
        if (Session.get('SESSION_CMNT3')) {
            ratingtext3 = Session.get('SESSION_CMNT3')
        } else {
            ratingtext3 = Sessions.findOne().comment3
        }
        if (Session.get('BASE6_SESSION_CMNT1')) {
            base6ratingtext1 = Session.get('BASE6_SESSION_CMNT1')
        } else {
            base6ratingtext1 = Sessions.findOne().base6_comment1
        }
        if (Session.get('BASE6_SESSION_CMNT2')) {
            base6ratingtext2 = Session.get('BASE6_SESSION_CMNT2')
        } else {
            base6ratingtext2 = Sessions.findOne().base6_comment2
        }


        if (Session.get('logo')) {
            logo = Session.get('logo')
        } else {
            logo = Sessions.findOne().logo
        }
        if (Session.get('surveyTopBanner')) {
            surveyTopBanner = Session.get('surveyTopBanner')
        } else {
            surveyTopBanner = Sessions.findOne().surveyTopBanner
        }
        if (Session.get('surveyBottomBanner')) {
            surveyBottomBanner = Session.get('surveyBottomBanner')
        } else {
            surveyBottomBanner = Sessions.findOne().surveyBottomBanner
        }

         if (Session.get('thankyouTopBanner')) {
            thankyouTopBanner = Session.get('thankyouTopBanner')
        } else {
            thankyouTopBanner = Sessions.findOne().thankyouTopBanner
        }
        if (Session.get('thankyouBottomBanner')) {
            thankyouBottomBanner = Session.get('thankyouBottomBanner')
        } else {
            thankyouBottomBanner = Sessions.findOne().thankyouBottomBanner
        }



        if (Session.get('SESSION_HEADER_FONT')) {
            headerColorHex = Session.get('SESSION_HEADER_FONT')
        } else {
            headerColorHex = Sessions.findOne().header_font_color
        }


        if (Session.get('SESSION_TOP')) {
            topColorHex = Session.get('SESSION_TOP')
        } else {
            topColorHex = Sessions.findOne().top_color
        }


        if (Session.get('SESSION_BOTTOM')) {
            bottomColorHex = Session.get('SESSION_BOTTOM')
        } else {
            bottomColorHex = Sessions.findOne().bottom_color
        }




        if (Session.get('SESSION_RATING_COLOR')) {
            rating_color = Session.get('SESSION_RATING_COLOR')
        } else {
            rating_color = Sessions.findOne().rating_color
        }
        console.log({
            defaultComment      : defaultratingtext,
            comment1            : ratingtext1,
            comment2            : ratingtext2,
            comment3            : ratingtext3,
            base6_comment1      : base6ratingtext1,
            base6_comment1      : base6ratingtext2,
            platform_message    : text2,
            senderName          : text3,
            platform_delay      : platform_delay,
            header_font_color   : headerColorHex,

            top_color          : topColorHex,
            bottom_color       : bottomColorHex,

            logo                : logo,
            surveyTopBanner     : surveyTopBanner,
            surveyBottomBanner  : surveyBottomBanner,
            thankyouTopBanner   : thankyouTopBanner,
            thankyouBottomBanner: thankyouBottomBanner,
            email_subject       : email_subject,
            rating_color        : rating_color,
        })
        // Insert new question into the collection
        //if (text) {
        Meteor.call(
            "updateSession",
            this._id,
            {
                defaultComment      : defaultratingtext,
                comment1            : ratingtext1,
                comment2            : ratingtext2,
                comment3            : ratingtext3,
                base6_comment1      : base6ratingtext1,
                base6_comment2      : base6ratingtext2,
                platform_message    : text2,
                senderName          : text3,
                platform_delay      : platform_delay,
                header_font_color   : headerColorHex,

                top_color          : topColorHex,
                bottom_color       : bottomColorHex,

                logo                : logo,
                surveyTopBanner     : surveyTopBanner,
                surveyBottomBanner  : surveyBottomBanner,
                thankyouTopBanner   : thankyouTopBanner,
                thankyouBottomBanner: thankyouBottomBanner,
                email_subject       : email_subject,
                rating_color        : rating_color
            },
            function (err, response) {
                if (err) {
                    alert(err);
                }
                else {
                    if (response.error) {
                        alert(response.message);
                    }
                    else {
                        var selectEl = template.find("#noq");
                        var noq = Number(selectEl.value);
                        var surveyQnIds = [];
                        var qElemnts = template.$(".question-item");
                        console.log(qElemnts);
                        $(qElemnts).each(function () {
                            surveyQnIds.push($(this).attr("id"));
                        });

                        console.log("surveyQnIds");
                        console.log(surveyQnIds);

                        if (!surveyQnIds.length) {
                            alert("at least one question is required!");
                            return;
                        }

                        if (surveyQnIds.length < noq) {
                            alert("You have forgotten to enter some questions");
                            return;
                        }

                        var toBeDeleted = surveyQnIds.splice(noq);

                        if (!!toBeDeleted.length) {
                            Meteor.call("finishQuestions", toBeDeleted);
                        }
                        Router.go('home');
                    }
                }
            });
    },
    'click #switch': function (event, template) {
        //console.log('selectId', this._id);
        // event.preventDefault();

        var status = false;
        if ($('#switch').is(":checked"))        {
            status = true;
        }
        console.log(status);
        Meteor.call("changeMailStreamStatus", this._id, status);
    },

    'click #switch1': function (event, template) {
        //console.log('selectId', this._id);
        // event.preventDefault();

        var status = false;
        if ($('#switch1').is(":checked"))        {
            status = true;
        }
        console.log("Comment box "+status);
        Meteor.call("changeCommentBoxStatus", this._id, status);
    }
});