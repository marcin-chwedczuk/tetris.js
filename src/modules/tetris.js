
'use strict';

var TetrisPresenter = require('modules/tetrisPresenter.js').TetrisPresenter;
// var PIECES = require('modules/pieces.js');
var getRandomPiece = require('modules/piecesGenerator.js').getRandomPiece;

function Tetris(containerElement) {
    this._presenter = new TetrisPresenter(containerElement);
    this.initGame();
}

Tetris.prototype.initGame = function() {
    this._currentPiece = getRandomPiece();
    this._nextPiece = getRandomPiece();

    this._presenter.setLevel(1);
    this._presenter.setPoints(0);
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
            // this._presenter.rotate();
            this._currentPiece.translate(-1,0);
        }
        else if (ks.isLeftArrowPressed()) {
            this._currentPiece.translate(0,-1);
        }
        else if (ks.isRightArrowPressed()) {
            this._currentPiece.translate(0,+1);
        }
        else if (ks.isSpacePressed()) {
            this._lock = true;
            this._currentPiece.rotateClockwise();
            this._presenter.swap(this._currentPiece.getBlocks(), function() {
                console.log('ANIMATION ENDED');
                this._lock = false;
            }.bind(this));
            return;
        }
        else { return; }

        this._presenter.draw(this._currentPiece.getBlocks());
    }
    finally {
        ks.clear();
    }
};

exports.Tetris = Tetris;
