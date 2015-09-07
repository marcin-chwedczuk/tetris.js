'use strict';

var Menu = require('./menu.js').Menu;

function MainMenu(containerElement) {
    Menu.call(this, containerElement, 'menu_template');
}

MainMenu.prototype = Object.create(Menu.prototype);
MainMenu.prototype.constructor = MainMenu;

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
