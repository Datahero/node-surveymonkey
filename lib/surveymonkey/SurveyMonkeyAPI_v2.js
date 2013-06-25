var http = require('http'),
    request = require('request'),
    helpers = require('./helpers');

/**
 * SurveyMonkey API wrapper for the API version 1.3. This object should not be 
 * instantiated directly but by using the version wrapper {@link SurveyMonkeyAPI}.
 * 
 * @param apiKey The API key to access the SurveyMonkey API with
 * @param options Configuration options
 * @return Instance of {@link SurveyMonkeyAPI_v1_3}
 */
function SurveyMonkeyAPI_v2 (apiKey, options) {

  if (!options) {
    options = {};
  }

  this.version     = 'v2';
  this.apiKey      = apiKey;
  this.secure      = options.secure || false;
  this.packageInfo = options.packagInfo;
  this.datacenter  = this.datacenter[1];
  this.httpUri     = (this.secure) ? 'https://api.surveymonkey.net' : 'https://api.surveymonkey.net';
  this.userAgent   = options.userAgent+' ' || '';
}

module.exports = SurveyMonkeyAPI_v2;

/**
 * Sends a given request as a JSON object to the SurveyMonkey API and finally
 * calls the given callback function with the resulting JSON object. This 
 * method should not be called directly but will be used internally by all API
 * methods defined.
 * 
 * @param method SurveyMonkey API method to call
 * @param availableParams Parameters available for the specified API method
 * @param givenParams Parameters to call the SurveyMonkey API with
 * @param callback Callback function to call on success 
 */
SurveyMonkeyAPI_v2.prototype.execute = function (method, availableParams, givenParams, callback) {

  var finalParams = { apikey : this.apiKey };
  var currentParam;

  for (var i = 0; i < availableParams.length; i++) {
    currentParam = availableParams[i];
    if (typeof givenParams[currentParam] !== 'undefined')
      finalParams[currentParam] = givenParams[currentParam];
  }

  request({
    uri : this.httpUri+'/'+this.version+'/'+method,
    method: 'POST',
    headers : { 'User-Agent' : this.userAgent+'node-surveymonkey/'+this.packageInfo['version'] },
    body : JSON.stringify(finalParams)
  }, function (error, response, body) {
    var parsedResponse;
    if (error) {
      callback(new Error('Unable to connect to the SurveyMonkey API endpoint.'));
    } else {

      try {
        parsedResponse = JSON.parse(body);
      } catch (error) {
        callback(new Error('Error parsing JSON answer from SurveyMonkey API.'));
        return;
      }

      if (parsedResponse.error) {
        callback(helpers.createSurveyMonkeyError(parsedResponse.error, parsedResponse.code));
        return;
      }

      callback(null, parsedResponse);

    }
  });

};

/*****************************************************************************/
/************************* Survey Related Methods **************************/
/*****************************************************************************/

/**
 * Retrieves a paged list of surveys in a user's account.
 * 
 * @see https://developer.surveymonkey.com/mashery/get_survey_list
 */
SurveyMonkeyAPI_v2.prototype.getSurveyList = function (params, callback) {
  if (typeof params == 'function') callback = params, params = {};
  this.execute('get_survey_list', [], params, callback);
};