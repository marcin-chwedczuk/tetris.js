'use strict';

var log = require('utils/logger.js').log;
var utils = require('utils/utils.js');

var serializeObject = function(value) {
    var valueJson = JSON.stringify(value);
    var cookieSafeValue = encodeURIComponent(valueJson);

    return cookieSafeValue;
};

var deserializeObject = function(cookieValue) {
    try {
        var json = decodeURIComponent(cookieValue);
        var object = JSON.parse(json);

        return object;
    }
    catch(e) {
        log.error('cannot deserialize value from cookie: {0}, cookieValue: {1}', e.message, cookieValue);
        return null;
    }
};

var cookies = null;

exports.getCookieValue = function(cookieName, defaultValue) {
    if (!cookies) {
        var notParsedCookies = document.cookie.split('; ');

        cookies = {};
        for (var i = 0; i < notParsedCookies.length; i += 1) {
            var splitIndex = notParsedCookies[i].indexOf('=');
            var name = notParsedCookies[i].substring(0, splitIndex);
            var value = notParsedCookies[i].substring(splitIndex+1);

            cookies[name] = deserializeObject(value);
        }
    }

    return cookies[cookieName] || defaultValue;
};

exports.setCookieValue = function(cookieName, cookieValue) {
    var HUNDRED_YEARS_IN_SECONDS = 60*60*24*356*100;

    var cookieSafeValue = serializeObject(cookieValue);

    document.cookie = cookieName + '=' + cookieSafeValue + ';max-age=' + HUNDRED_YEARS_IN_SECONDS;
    cookies[cookieName] = utils.copyObject(cookieValue);
};

exports.clearCookieCache = function() {
    cookies = null;
};
