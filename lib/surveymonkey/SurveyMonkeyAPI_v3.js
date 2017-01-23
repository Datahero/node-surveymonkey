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
function SurveyMonkeyAPI_v3 (accessToken, options) {

	if (!options) {
		options = {};
	}

	this.version     = 'v3';
	this.accessToken = accessToken;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
	this.httpUri     = (this.secure) ? 'https://api.surveymonkey.net' : 'https://api.surveymonkey.net';
	this.userAgent   = options.userAgent+' ' || '';
	
}

module.exports = SurveyMonkeyAPI_v3;

/**
 * Sends a given request as a JSON object to the SurveyMonkey API and finally
 * calls the given callback function with the resulting JSON object. This 
 * method should not be called directly but will be used internally by all API
 * methods defined.
 * 
 * @param resource SurveyMonkey API resource to call
 * @param method SurveyMonkey API method to call
 * @param givenParams Parameters to call the SurveyMonkey API with
 * @param callback Callback function to call on success 
 */
SurveyMonkeyAPI_v3.prototype.execute = function (type, resource, method, id, givenParams, callback) {
	
	var uri = {
		'responses_bulk' : this.httpUri + '/' + this.version + '/' + resource + '/' + id.survey_id + '/responses/bulk',
		'responses' : this.httpUri + '/' + this.version + '/' + resource + '/' + id.survey_id + '/' + method,
		'get_responses' : this.httpUri + '/' + this.version + '/' + resource + '/' + id.survey_id,
		'get_survey_details' : this.httpUri + '/' + this.version + '/' + resource + '/' + id.survey_id + '/details',
		'get_survey_list' : this.httpUri + '/' + this.version + '/' + resource,
		'get_collector_list' : this.httpUri + '/' + this.version + '/' + resource + '/' + id.survey_id + '/collectors',
		'get_response_counts' : this.httpUri + '/' + this.version + '/' + resource + '/' + id.collector_id + '/responses',
		'get_user_details' : this.httpUri + '/' + this.version + '/' + resource + '/me'
	};
	
	function serialize(obj) {
  	return '?' + Object.keys(obj).map(k => k + '=' + encodeURIComponent(obj[k])).join('&');
	}

	request({
		uri : uri[method] + serialize(givenParams),
		method: type,
		//headers : { 'User-Agent' : this.userAgent+'node-surveymonkey/'+this.packageInfo.version },
		headers : { 'Authorization' : 'bearer ' + this.accessToken,
		'Content-Type' : 'application/json' }
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

			if (parsedResponse.errmsg) {
				callback(helpers.createSurveyMonkeyError(parsedResponse.errmsg, parsedResponse.status));
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
 * Retrieves a paged list of respondents for a given survey and optionally collector bulk
 * 
 * 
 */
SurveyMonkeyAPI_v3.prototype.getRespondentListBulk = function (params, callback) {
	if (typeof params === 'function') callback = params, params = {};
	this.execute('GET', 'surveys', 'responses_bulk', [
		'survey_id'
	], params, callback);
};

/**
 * Retrieves a paged list of respondents for a given survey and optionally collector
 * 
 * @see https://developer.surveymonkey.com/mashery/get_respondent_list
 */
SurveyMonkeyAPI_v3.prototype.getRespondentList = function (params, callback) {
	if (typeof params === 'function') callback = params, params = {};
	this.execute('GET', 'surveys', 'responses', [
		'survey_id'
	], params, callback);
};

/**
 * Takes a list of respondent ids and returns the responses that correlate to them. To be used with 'get_survey_details'
 * 
 * @see https://developer.surveymonkey.com/mashery/get_responses
 */
SurveyMonkeyAPI_v3.prototype.getResponses = function (params, callback) {
	if (typeof params === 'function') callback = params, params = {};
	this.execute('GET','responses', 'get_responses', [
		'survey_id',
		'respondent_ids'
	], params, callback);
};

/**
 * Retrieve a given survey's metadata.
 * 
 * @see https://developer.surveymonkey.com/mashery/get_survey_details
 */
SurveyMonkeyAPI_v3.prototype.getSurveyDetails = function (params, callback) {
	if (typeof params === 'function') callback = params, params = {};
	this.execute('GET', 'surveys', 'get_survey_details', [
		'survey_id'
	], params, callback);
};

/**
 * Retrieves a paged list of surveys in a user's account.
 * 
 * @see https://developer.surveymonkey.com/mashery/get_survey_list
 */
SurveyMonkeyAPI_v3.prototype.getSurveyList = function (params, callback) {
	if (typeof params === 'function') callback = params, params = {};
	this.execute('GET' ,'surveys', 'get_survey_list', [], params, callback);
};

/**
 * Retrieves a paged list of surveys in a user's account.
 * 
 * @see https://developer.surveymonkey.com/mashery/get_collector_list
 */
SurveyMonkeyAPI_v3.prototype.getCollectorList = function (params, callback) {
	if (typeof params === 'function') callback = params, params = {};
	this.execute('GET', 'surveys', 'get_collector_list', [
		'survey_id'
	], params, callback);
};

/**
 * Returns how many respondents have started and/or completed the survey for the given collector.
 * 
 * @see https://developer.surveymonkey.com/mashery/get_response_counts
 */
SurveyMonkeyAPI_v3.prototype.getResponseCounts = function (params, callback) {
	if (typeof params === 'function') callback = params, params = {};
	this.execute('GET', 'collectors', 'get_response_counts', [
		'collector_id'
	], params, callback);
};

/**
 * Returns basic information about the logged-in user.
 * 
 * @see https://developer.surveymonkey.com/mashery/get_user_details
 */
SurveyMonkeyAPI_v3.prototype.getUserDetails = function (params, callback) {
	if (typeof params === 'function') callback = params, params = {};
	this.execute('GET', 'users', 'get_user_details', [], params, callback);
};
