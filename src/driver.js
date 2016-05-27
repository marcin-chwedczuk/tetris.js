'use strict';

var log = require('utils/logger.js').log;
var KeyboardState = require('keyboardState.js').KeyboardState;

var Tetris = require('modules/tetris.js').Tetris;
var MainMenu = require('modules/mainMenu.js').MainMenu;
var TopScores = require('modules/topScores.js').TopScores;
var Settings = require('modules/settings.js').Settings;
var About = require('modules/about.js').About;

var gameSettings = require('gameSettings.js');

function Driver() {
    this._destructors = [];

    this._module = null;
    this._containerElement = null;

    this.keyboardState = new KeyboardState();
}

Driver.prototype.init = function() {
    log.debug('initializing driver...');

    gameSettings.load();

    this._containerElement = document.getElementById('container');
    this._initKeyboard(window);
};

Driver.prototype.setModule = function(ModuleConstructor) {
    if (typeof(ModuleConstructor) === 'string') {
        switch(ModuleConstructor) {
        case 'Tetris':
            ModuleConstructor = Tetris;
            break;

        case 'MainMenu':
            ModuleConstructor = MainMenu;
            break;

        case 'TopScores':
            ModuleConstructor = TopScores;
            break;

        case 'Settings':
            ModuleConstructor = Settings;
            break;

        case 'About':
            ModuleConstructor = About;
            break;

        default:
            throw new Error('Unknown module: ' + ModuleConstructor);
        }
    }

    this.keyboardState.reset();
    this._module = new ModuleConstructor(this._containerElement, this);
};

Driver.prototype.start = function() {
    var lastTime = (new Date()).getTime();

    var handler = function() {
        var currentTime = (new Date()).getTime();
        var diffMs = (currentTime - lastTime);
        lastTime = currentTime;

        this.keyboardState.refresh();
        this._module.run(this, diffMs);
        
        var interval = this._module.getInterval ?
            this._module.getInterval() :
            1000/25;
        setTimeout(handler, interval);

    }.bind(this);

    handler();
};

Driver.prototype.destroy = function() {
    log.debug('destroying driver...');

    this._containerElement = null;
    this._module = null;
    this._runDestructors();
};

Driver.prototype._initKeyboard = function(window) {
    var handler = function(pressed, e) {
        console.log('key: ' + e.keyCode + ' : ' + pressed);

        switch(e.keyCode) {
        // arrows
        case 38:
            this.keyboardState.setUpArrowPressed(pressed);
            break;

        case 40:
            this.keyboardState.setDownArrowPressed(pressed);
            break;

        case 37:
            this.keyboardState.setLeftArrowPressed(pressed);
            break;

        case 39:
            this.keyboardState.setRightArrowPressed(pressed);
            break;

        // other
        case 13:
            this.keyboardState.setEnterPressed(pressed);
            break;

        case 27:
            this.keyboardState.setEscapePressed(pressed);
            break;

        case 32:
            this.keyboardState.setSpacePressed(pressed);
            break;
        }
    };

    var downHandler = handler.bind(this, true);
    var upHandler = handler.bind(this, false);

    window.addEventListener('keydown', downHandler, false);
    window.addEventListener('keyup', upHandler, false);

    this._registerDestructor(function() {
        window.removeEventListener('keydown', downHandler, false);
        window.removeEventListener('keyup', upHandler, false);
    });
};

Driver.prototype._registerDestructor = function(destructorFn) {
    this._destructors.push(destructorFn);
};

Driver.prototype._runDestructors = function() {
    while (this._destructors.length) {
        var destructorFn = this._destructors.shift();
        destructorFn();
    }
};

exports.Driver = Driver;
