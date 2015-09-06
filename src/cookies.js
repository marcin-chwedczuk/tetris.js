'use strict';

var cookies = null;

exports.getCookieValue = function(cookieName) {
    if (!cookies) {
        var notParsedCookies = document.cookie.split('; ');

        cookies = {};
        for (var i = 0; i < notParsedCookies.length; i += 1) {
            var splitIndex = notParsedCookies[i].indexOf('=');
            var name = notParsedCookies[i].substring(0, splitIndex);
            var value = notParsedCookies[i].substring(splitIndex+1);

            cookies[name] = value;
        }
    }

    return cookies[cookieName];
};

exports.setCookieValue = function(cookieName, cookieValue) {
    // max age = 100 years
    document.cookie = cookieName + '=' + cookieValue + ';max-age=' + 3153.0e5;
    cookies[cookieName] = cookieValue;
};

exports.clearCookieCache = function() {
    cookies = null;
};
