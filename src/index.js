'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var languageStrings = {    
    "en-US": {
        "translation": {            
            "SKILL_NAME" : "Nomad List",
            "HELP_MESSAGE" : "Ask me where you should live!",
            "HELP_REPROMPT" : "Ask me where you'd like to live!",
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
        this.emit('RandomCity');
    },
    'GetRandomCityIntent': function () {
        this.emit('RandomCity');
    },
    'RandomCity': function () {
        var origThis = this;
        request('https://nomadlist.com/api/v2/list/cities', function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            var cityIndex = Math.floor(Math.random() * json.result.length);
            var city = json.result[cityIndex];
            var message = `You can live in ${city.info.city.name}, ${city.info.country.name}, and pay ${city.cost.nomad.USD} on dollars per month.`;
            
            origThis.emit(':tellWithCard', message, origThis.t("SKILL_NAME"), message);
          }
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