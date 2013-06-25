var SurveyMonkeyAPI_v2 = require('./SurveyMonkeyAPI_v2');

/**
 * Returns a SurveyMonkey API wrapper object of the specified version. Only version v2
 * is currently supported
 * 
 * Available options are:
 *  - version   The API version to use (v2). Defaults to v2.
 *  - secure    Whether or not to use secure connections over HTTPS 
 *              (true/false). Defaults to false.
 *  - userAgent Custom User-Agent description to use in the request header. 
 * 
 * @param apiKey The API key to access the SurveyMonkey API with
 * @param options Configuration options as described above
 * @return Instance of the SurveyMonkey API in the specified version
 */
function SurveyMonkeyAPI (apiKey, options) {

  if (!options) {
    options = {};
  }

  if (!apiKey) {
    throw new Error('You have to provide an API key for this to work.');
  }

  options.packageInfo = {
    "version" : "v2"
  };

  if (!options.version || options.version == 'v2') {
    return new SurveyMonkeyAPI_v2(apiKey, options);
  } else {
    throw new Error('Version ' + options.version + ' of the SurveyMonkey API is currently not supported.');
  }

}

module.exports = SurveyMonkeyAPI;