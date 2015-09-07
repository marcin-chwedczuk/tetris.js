'use strict';

var Menu = require('./menu.js').Menu;
var gameSettings = require('gameSettings.js');

function Settings(containerElement) {
    Menu.call(this, containerElement, 'settings_template');
}

Settings.prototype = Object.create(Menu.prototype);
Settings.prototype.constructor = Settings;

Settings.prototype._createMenu = function() {

    this.addCheckbox('Audio', gameSettings.isAudioEnabled(), function(driver, isEnabled) {
        if (isEnabled) {
            gameSettings.enableAudio();
        }
        else {
            gameSettings.disableAudio();
        }
    });

    this.addButton('Save', function(driver) {
        gameSettings.save();
        driver.setModule('MainMenu');
    }, 
    { 
        cssClass: 'with-separator'
    });

    this.addButton('Discard', function(driver) {
        gameSettings.load();
        driver.setModule('MainMenu');
    });
};

Settings.prototype.escapeHandler = function(driver) {
    gameSettings.load();
    driver.setModule('MainMenu');
};

exports.Settings = Settings;
