var SurveyMonkeyAPI_v3 = require('./SurveyMonkeyAPI_v3');

/**
 * Returns a SurveyMonkey API wrapper object for v3. v2 is hard depricated
 * 
 * Available options are:
 *  - version   The API version to use (v3). Defaults to v3.
 *  - secure    Whether or not to use secure connections over HTTPS 
 *              (true/false). Defaults to false.
 *  - userAgent Custom User-Agent description to use in the request header. 
 * 
 * @param credentials - requires client_id, client_secret, code (which can be found in URL after initial authentication), redirect_uri
 * @param accessToken The oAuth accesstoken if already completed for the user, or null if not
 * @param options Configuration options as described above
 * @return Instance of the SurveyMonkey API in the specified version
 */
function SurveyMonkeyAPI (accessToken, options) {

  if (!options) {
    options = {};
  }

  if (!accessToken) {
    throw new Error('You have to provide an Access Token for this to work.');
  }

  options.packageInfo = {
    "version" : "v3"
  };

  if (!options.version || options.version === 'v3') {
    return new SurveyMonkeyAPI_v3(accessToken, options);
  } else {
    throw new Error('Version ' + options.version + ' of the SurveyMonkey API is currently not supported.');
  }

}

module.exports = SurveyMonkeyAPI;