  'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('trianz');
var FAADataHelper = require('./faa_data_helper');

  app.launch(function(req, res) {
    var prompt = 'Tell me what you want to know.';
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
  });

  app.intent('trianz', {
    'utterances': ['{|ask} {|policy|policies} {|details|detail} {|at} {|NYL}']
  },
  function(req, res) {
    //console.log("Here in Intent Call");

    var faaHelper = new FAADataHelper();
    var reprompt = 'Tell me some details to help you out with requirement.';
      faaHelper.requestPolicyStatus().then(function(policyStatus) {
        res.say(faaHelper.formatPolicyStatus(policyStatus)).send();
      }).catch(function(err) {
        console.log(err);
        var prompt = 'I didn\'t have data for you currently.';
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
  });

  app.intent('trianzclaim', {
    'utterances': ['{|ask} {|claim|claims} {|details|detail}']
  },
  function(req,res){
    console.log('In this Block');
    var faaHelper = new FAADataHelper();
    var reprompt = 'Tell me some details to help you out with requirement.';
      faaHelper.requestClaimStatus().then(function(claimStatus) {
        console.log(claimStatus);
        res.say(faaHelper.formatClaimStatus(claimStatus)).send();
      }).catch(function(err) {
        console.log(err);
        var prompt = 'I didn\'t have data for you currently.';
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
  });

//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
