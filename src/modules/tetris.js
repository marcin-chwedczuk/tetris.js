
'use strict';

var TetrisPresenter = require('modules/tetrisPresenterNA.js').TetrisPresenter;
var getRandomPiece = require('modules/piecesGenerator.js').getRandomPiece;
var Gameboard = require('modules/gameboard.js').Gameboard;
var utils = require('utils/utils.js');

function Tetris(containerElement) {
    this._presenter = new TetrisPresenter(containerElement);
    this._presenter.init();

    this._oldPosition = [];
    this.initGame();
}

Tetris.prototype.initGame = function() {
    this._gameboard = new Gameboard();
    this._nextPiece = getRandomPiece();

    this._presenter.setLevel(1);
    this._presenter.setPoints(0);

    this._nextCurrentPiece();

    this._time = 0;
    this._movementFrame = 0;
};

Tetris.prototype._nextCurrentPiece = function() {
    this._currentPiece = this._nextPiece;
    this._nextPiece = getRandomPiece();
    
    this._centerCurrentPiece();

    this._presenter.updateNext(this._nextPiece);
};

Tetris.prototype._centerCurrentPiece = function() {
    var box = this._currentPiece.boundingBox();

    var pieceWidth = box.width();
    var gameboardWidth = this._gameboard.width();

    var offsetCol = utils.getRandomElement([
        Math.floor((gameboardWidth-pieceWidth)/2),
        Math.floor((gameboardWidth-pieceWidth+1)/2)
    ]);
    offsetCol -= box.minCol;

    var offsetRow = (box.height() === 1) ? 1 : 0;
    offsetRow -= this._gameboard.hiddenHeight();
    
    this._currentPiece.translate(offsetRow, offsetCol);
};

Tetris.prototype._tryRotateCurrentPiece = function()  {
    this._currentPiece.savePositionTo(this._oldPosition);

    this._currentPiece.rotateClockwise();
    if (this._gameboard.hasValidPosition(this._currentPiece)) {
        return true;
    }

    // side kicks from walls
    this._currentPiece.translate(0,-1);
    if (this._gameboard.hasValidPosition(this._currentPiece)) {
        return true;
    }

    this._currentPiece.translate(0, 1);
    if (this._gameboard.hasValidPosition(this._currentPiece)) {
        return true;
    }

    // TODO: Make buzz sound
    this._currentPiece.restorePositionFrom(this._oldPosition);
    return false;
};

Tetris.prototype._tryTranslateCurrentPiece = function(drow, dcol) {
    this._currentPiece.savePositionTo(this._oldPosition);
    this._currentPiece.translate(drow, dcol);

    if (this._gameboard.hasValidPosition(this._currentPiece)) {
        return true;
    }
    else {
        this._currentPiece.restorePositionFrom(this._oldPosition);
        return false;
    }
};

Tetris.prototype._isLocked = function() {
    return (this._lock > 0);
};

Tetris.prototype._lockFor = function(timeMs) {
    var that = this;

    that._lock = that._lock || 0;
    that._lock++;

    setTimeout(function() {
        that._lock--;
    }, timeMs);
};

Tetris.prototype._addToCommandQueue = function(ks) {
    var command = null;

    if (ks.isEscapePressed()) {
        command = 'esc';
    }
    else if (ks.isDownArrowPressed()) {
        command = 'down';
    }
    else if (ks.isUpArrowPressed()) {
        command = 'up';
    }
    else if (ks.isRightArrowPressed()) {
        command = 'right';
    }
    else if (ks.isLeftArrowPressed()) {
        command = 'left';
    }
    else if (ks.isSpacePressed()) {
        command = 'space';
    }
    else {
        return;
    }

    this._command = command;
};

Tetris.prototype.run = function(driver, diffMs) {
    this._addToCommandQueue(driver.keyboardState);

    this._time += diffMs;

    if (this._isLocked()) {
        return;
    }

    var command = this._command;
    this._command = null;
    switch(command) {
        case 'down':
            this._tryTranslateCurrentPiece(2, 0);
            break;

        case 'left': case 'right':
            this._tryTranslateCurrentPiece(0, command === 'left' ? -1 : 1);
            break;

        case 'up':
            break;

        case 'space':
            this._nextCurrentPiece();
            break;
    }

    this._presenter.draw(this._currentPiece.getBlocks());
    this._presenter.draw(this._gameboard.getBlocks());

    this._presenter.swapBuffers();
    this._request = '';
};

exports.Tetris = Tetris;
