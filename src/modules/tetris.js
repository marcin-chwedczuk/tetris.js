
'use strict';

var TetrisPresenter = require('modules/tetrisPresenter.js').TetrisPresenter;
var getRandomPiece = require('modules/piecesGenerator.js').getRandomPiece;
var Gameboard = require('modules/gameboard.js').Gameboard;
var utils = require('utils/utils.js');

function Tetris(containerElement) {
    this._presenter = new TetrisPresenter(containerElement);
    this._oldPosition = [];

    this.initGame();
}

Tetris.prototype.initGame = function() {
    this._gameboard = new Gameboard();
    this._nextPiece = getRandomPiece();

    this._presenter.setLevel(1);
    this._presenter.setPoints(0);

    this._nextCurrentPiece();
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

    this._currentPiece.translate(0, 2);
    if (this._gameboard.hasValidPosition(this._currentPiece)) {
        return true;
    }

    // TODO: Make buzz sound
    this._currentPiece.restorePositionFrom(this._oldPosition);
    return false;
};

Tetris.prototype.run = function(driver) {
    var ks = driver.keyboardState;

    try {
        if (ks.isEscapePressed()) {
            driver.setModule('MainMenu');
        }
        else if (ks.isDownArrowPressed()) {
            // this._presenter.moveDown();
            this._currentPiece.translate(+1,0);
        }
        else if (ks.isUpArrowPressed()) {
            this._nextCurrentPiece();
        }
        else if (ks.isLeftArrowPressed()) {
            this._currentPiece.translate(0,-1);
        }
        else if (ks.isRightArrowPressed()) {
            this._currentPiece.translate(0,+1);
        }
        else if (ks.isSpacePressed()) {
            if (this._tryRotateCurrentPiece()) {
                this._lock = true;
                this._presenter.rotateCurrent(this._currentPiece.getBlocks(), function() {
                    console.log('ANIMATION ENDED');
                    this._lock = false;
                }.bind(this));
                return;
            }
        }
        else { return; }

        this._presenter.updateCurrent(this._currentPiece);
        this._presenter.updateGameboard(this._gameboard);
    }
    finally {
        ks.clear();
    }
};

exports.Tetris = Tetris;
