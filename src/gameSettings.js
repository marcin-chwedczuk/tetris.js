'use strict';

var cookies = require('./cookies.js');
var utils = require('./utils.js');

var SETTINGS_COOKIE_NAME = 'settings';

function GameSettings() {
    this._audioEnabled = false;
}

GameSettings.prototype.enableAudio = function() {
    this._audioEnabled = true;
};

GameSettings.prototype.disableAudio = function() {
    this._audioEnabled = false;
};

GameSettings.prototype.isAudioEnabled = function() {
    return this._audioEnabled;
};

GameSettings.prototype.save = function() {
    cookies.setCookieValue(SETTINGS_COOKIE_NAME, this);
};

GameSettings.prototype.load = function() {
    var settings = cookies.getCookieValue(SETTINGS_COOKIE_NAME, null);
    if (settings) {
        utils.extend(this, settings);
    }
};

module.exports = new GameSettings();
