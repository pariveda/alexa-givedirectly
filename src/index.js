'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var languageStrings = {    
    "en-US": {
        "translation": {            
            "SKILL_NAME" : "Pariveda Solutions",
            "HELP_MESSAGE" : "Ask me questions about Pariveda Solutions!",
            "HELP_REPROMPT" : "You can ask: 'what does Pariveda Solutions do', 'where does Pariveda Solutions have offices', 'what is a fin', and 'why should I join Pariveda?'",
            "STOP_MESSAGE" : "Goodbye!"
        }
    }    
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.HelpIntent');
    },   
    'WhatDoesParivedaDoIntent': function () {
        output(this, "Pariveda Solutions, Inc. is a leading management consulting firm specializing in improving our clients' performance with strategic services and information technology solutions. We creatively solve complex, ambiguous business problems with our clients, mostly using technology.");
    },
    'WhatCitiesHaveOfficesIntent': function () {
        output(this, "Pariveda Solutions has offices in Atlanta, Chicago, Dallas, Houston, Los Angeles, New York, Philadelphia, San Francisco, Seattle, and Washington D.C.");
    },     
    'WhatIsAFinIntent': function () {
        output(this, "A fin is a Pariveda Solutions employee. We call our employees fins because our mascot is a dolphin.");
    },
    'WhyJoinIntent': function () {
        var reasons = ["It's an opportunity to work with other smart, friendly people.", "We have a proven employee development model where you can be promoted as soon as every year.", "We develop well-rounded consultants and don't pidgeon hole you into a specialization.", "We work in fun locations."];
        var index = Math.floor(Math.random() * reasons.length);
        var message = reasons[index] + " Ask again for another reason!";
        output(this, message);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.FallbackIntent': function () {
        var reprompt = this.t("HELP_REPROMPT");
        this.emit(':ask', "Sorry, I didn't understand. " + this.t("HELP_REPROMPT"));
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function output(obj, message) {    
    obj.emit(':tellWithCard', message, obj.t("SKILL_NAME"), message);
}