'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var languageStrings = {    
    "en-US": {
        "translation": {            
            "SKILL_NAME" : "GiveDirectly (unofficial)",
            "HELP_MESSAGE" : "Ask me how GiveDirectly helped today!",
            "HELP_REPROMPT" : "Ask how recipients used their transfers.",
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
        this.emit('GetPersonHelped');
    },
    'GetPersonHelpedIntent': function () {
        this.emit('GetPersonHelped');
    },      
    'GetPersonHelped': function () {
        outputResult(this, function(results) {
            console.log(results);
            var index = Math.floor(Math.random() * results.length);
            return results[index];
        });
    },    
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function outputResult(obj, findFunction) {
    request('https://www.givedirectly.org/newsfeed.json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        var elem = findFunction(json);
        output(obj, elem);
      }
    });
}

function output(obj, elem) {
    var message = elem.surveyPreview.response;
    
    obj.emit(':tellWithCard', message, obj.t("SKILL_NAME"), message);
}