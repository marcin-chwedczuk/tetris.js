'use strict';

var log = require('./utils/logger.js').log;
var KeyboardState = require('./keyboardState.js').KeyboardState;

var Tetris = require('./modules/tetris.js').Tetris;
var MainMenu = require('./modules/mainMenu.js').MainMenu;
var TopScores = require('./modules/topScores.js').TopScores;
var Settings = require('./modules/settings.js').Settings;
var About = require('./modules/about.js').About;

var gameSettings = require('./gameSettings.js');

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

    this._module = new ModuleConstructor(this._containerElement);
};

Driver.prototype.start = function() {
    var lastTime = (new Date()).getTime();

    var handler = function() {
        var currentTime = (new Date()).getTime();
        var diffMs = (currentTime - lastTime);
        lastTime = currentTime;

        this._module.run(this, diffMs);

        setTimeout(handler, 1000/25);
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
    var handler = function(e) {
        log.debug('key handler (keyCode: {0})', e.keyCode);

        switch(e.keyCode) {
        case 38:
            this.keyboardState.setUpArrowPressed(true);
            break;

        case 40:
            this.keyboardState.setDownArrowPressed(true);
            break;

        case 13:
            this.keyboardState.setEnterPressed(true);
            break;

        case 27:
            this.keyboardState.setEscapePressed(true);
            break;
        }
    }.bind(this);

    window.addEventListener('keydown', handler, false);

    this._registerDestructor(function() {
        window.removeEventListener('keydown', handler, false);
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
