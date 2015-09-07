'use strict';

var TetrisPresenter = require('./tetrisPresenter.js').TetrisPresenter;

function Tetris(containerElement) {
    this._presenter = new TetrisPresenter(containerElement);
}

Tetris.prototype.run = function() {

};

exports.Tetris = Tetris;
