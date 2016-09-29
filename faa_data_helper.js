'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var PolicyENDPOINT = 'http://ec2-52-201-219-172.compute-1.amazonaws.com:3000/api/policyinformation';
var ClaimENDPOINT = 'http://ec2-52-201-219-172.compute-1.amazonaws.com:3000/api/policyclaims';

function FAADataHelper() {
}
FAADataHelper.prototype.requestPolicyStatus = function() {
  return this.getPolicyStatus().then(
    function(response) {
      console.log(response.body);
      console.log('success - received details');
      return response.body;
    }
  );
};

FAADataHelper.prototype.getPolicyStatus = function() {
  var options = {
    method: 'GET',
    uri: PolicyENDPOINT,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
};

FAADataHelper.prototype.formatPolicyStatus = function(policyStatus) {
  var sentence;
  _.each(policyStatus.resultset, function(i,j){
    sentence += _.template('Your Policy number are ${weather}')({
      weather: i.policy_id
    });
    console.log(i.policy_id);
  });
  if (policyStatus.apiStatus == true) {
    console.log("Awsome Matches");
    var template = _.template('Hey here is your details, ${airport} and ${sentence}');
    return template({
      airport: policyStatus.message,
      sentence: sentence
    });
  } else {
    console.log("Its not working");
    //no delay
    return _.template('Sorry, this is your current status ${airport}')({
      airport: policyStatus.apiStatus
    });
  }
};


FAADataHelper.prototype.requestClaimStatus = function() {
  console.log("In request Block");
  return this.getClaimStatus().then(
    function(response) {
      console.log(response.body);
      console.log('success - received details');
      return response.body;
    }
  );
};

FAADataHelper.prototype.getClaimStatus = function() {
  var newCall = {
    method: 'GET',
    uri: ClaimENDPOINT,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(newCall);
};

FAADataHelper.prototype.formatClaimStatus = function(claimStatus) {
  var sentence = '';
  _.each(claimStatus.resultset, function(i,j){
    sentence += _.template('Your Claim product names are ${productName}. claimed amount is ${claimedAmount}. policy ID is ${policyID}')({
      productName: i.policy_product_name,
      claimedAmount: i.claim_requested_amount,
      policyID: i.policy_id
    });
    //console.log(i.policy_product_name+ ' ' +i.claim_requested_amount+ ' ' +i.policy_id);
  });
  if (policyStatus.apiStatus == true) {
    console.log("Awsome Matches");
    var template = _.template('Hey here is your details, ${overviewMessage} and ${sentence}');
    return template({
      overviewMessage: policyStatus.message,
      sentence: sentence
    });
  } else {
    console.log("Its not working");
    //no delay
    return _.template('Sorry, this is your current status ${overviewStatus}')({
      overviewStatus: policyStatus.apiStatus
    });
  }
};

module.exports = FAADataHelper;
