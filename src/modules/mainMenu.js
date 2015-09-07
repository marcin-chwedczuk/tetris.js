'use strict';

var MenuBase = require('modules/menuBase.js').MenuBase;

var MainMenu = MenuBase.extend(function(containerElement) {
    MenuBase.call(this, containerElement, 'menu_template');
});

MainMenu.prototype._createMenu = function() {
    this.addButton('Play', function(driver) {
        driver.setModule('Tetris');
    });

    this.addButton('Top Scores', function(driver) {
        driver.setModule('TopScores');
    });

    this.addButton('Settings', function(driver) {
        driver.setModule('Settings');
    });

    this.addButton('About', function(driver) {
        driver.setModule('About');
    });

    this.addButton('Exit', function() {
        // window.close() doesn't work in recent browsers
        // insted of closing game window we redirect user to
        // homepage
        window.location = '/';
    });
};

exports.MainMenu = MainMenu;
