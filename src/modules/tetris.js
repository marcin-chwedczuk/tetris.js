'use strict';

var TetrisPresenter = require('modules/tetrisPresenter.js').TetrisPresenter;

function Tetris(containerElement) {
    this._presenter = new TetrisPresenter(containerElement);
    this.initGame();
}

Tetris.prototype.initGame = function() {
    this._presenter.setLevel(1);
    this._presenter.setPoints(0);
};

Tetris.prototype.run = function(driver) {
    var ks = driver.keyboardState;

    if (ks.isEscapePressed()) {
        driver.setModule('MainMenu');
    }
    else if (ks.isDownArrowPressed()) {
        this._presenter.moveDown();
    }
    else if (ks.isUpArrowPressed()) {
        this._presenter.rotate();
    }

    ks.clear();
};

exports.Tetris = Tetris;
