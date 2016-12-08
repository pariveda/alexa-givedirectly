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
    'GetCityByNameIntent': function () {
        this.emit('CityByName');
    },    
    'RandomCity': function () {
        outputMatchingCity(this, function(results) {
            console.log(results);
            var cityIndex = Math.floor(Math.random() * results.length);
            return results[cityIndex];
        });
    },
    'CityByName': function () {
        console.log("INTENT: " + JSON.stringify(this.event.request.intent));
        var cityName = this.event.request.intent.slots.CityName.value;
        outputMatchingCity(this, function(results) {
            return results.find(function(city) {
                return (city.info.city.name === cityName);
            });
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

function outputMatchingCity(obj, findFunction) {
    request('https://nomadlist.com/api/v2/list/cities', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        var city = findFunction(json.result);
        output(obj, city);
      }
    });
}

function output(obj, city) {
    var message = "";
    if(city && city.info) {    
        message = `You can live in ${city.info.city.name}, ${city.info.country.name}, and pay ${city.cost.nomad.USD} dollars per month.`;        
    } else {
        message = "Sorry, I wasn't able to find that city.";
    }
    
    obj.emit(':tellWithCard', message, obj.t("SKILL_NAME"), message);
}