# node-surveymonkey

A node.js library for the SurveyMonkey API

_node-surveymonkey_ exposes the following features of the SurveyMonkey API to your node.js application:
 
 * SurveyMonkey API (Versions v3)
 
 SurveyMonkey API (Version v2) has been hard deprecated. See [https://help.surveymonkey.com/articles/en_US/kb/Transitioning-to-SurveyMonkey-s-v3-API](https://help.surveymonkey.com/articles/en_US/kb/Transitioning-to-SurveyMonkey-s-v3-API)

Further information on the SurveyMonkey API and its features is available at [https://developer.surveymonkey.com](https://developer.surveymonkey.com)

## Installation

Installing using npm (node package manager):

    npm install surveymonkey
    
If you don't have npm installed or don't want to use it:

    cd ~/.node_libraries
    git clone git@github.com:Datahero/node-surveymonkey.git

Please note that parts of _node-surveymonkey_ depend on [request](http://github.com/mikeal/request) by [Mikeal Rogers](http://github.com/mikeal). This library needs to be installed for the API to work. Additionally [node-querystring](http://github.com/visionmedia/node-querystring) is required. If you are using npm all dependencies should be automagically resolved for you.

## Usage

Information on how to use the SurveyMonkey APIs can be found below. Further information on the API methods available can be found at [https://developer.surveymonkey.com](https://developer.surveymonkey.com). You can also find further information on how to obtain an OAuth2 access token in your SurveyMonkey account and much more on the SurveyMonkey API pages.

### SurveyMonkey API

_SurveyMonkeyAPI_ takes two arguments.
1. The first argument is your oAuth access token.
2. The second argument is an options object which can contain the following options:

 * `version` The API version to use. Defaults to v3.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.
 
The callback function for each API method gets two arguments. The first one is an error object which is null when no error occurred, the second one an object with all information retrieved as long as no error occurred.

Example:

```javascript
var SurveyMonkeyAPI = require('surveymonkey').SurveyMonkeyAPI;

var accessToken = 'Your SurveyMonkey App Access Token';

try { 
    var api = new SurveyMonkeyAPI(accessToken, { version : 'v3', secure : false });
} catch (error) {
    console.log(error.message);
}

api.getSurveyList({}, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});

// or with a survey id
api.getSurveyDetails({id:'113260729'},function (error, data) {
    if (error)
        console.log(error);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```
  
## License

_node-surveymonkey_ is licensed under the MIT License. (See LICENSE) 
