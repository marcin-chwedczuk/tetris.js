
'use strict';

var TetrisPresenter = require('modules/tetrisPresenterNA.js').TetrisPresenter;
var Gameboard = require('modules/gameboard.js').Gameboard;
var TetrisTimings = require('modules/tetrisTimings.js');
var getRandomPiece = require('modules/piecesGenerator.js').getRandomPiece;
var utils = require('utils/utils.js');

function Tetris(containerElement, driver) {
    this._timings = new TetrisTimings();
    this._presenter = new TetrisPresenter(containerElement);
    this._presenter.init();

    this._oldPosition = [];
    this.initGame(driver);
}

Tetris.prototype.destroy = function() {
    this._presenter.destroy();
};

Tetris.prototype.initGame = function(driver) {
    driver.keyboardState.disableRepeat('UpArrow');

    this._gameboard = new Gameboard();
    this._nextPiece = getRandomPiece();

    this._presenter.setLevel(1);
    this._presenter.setPoints(0);

    this._nextCurrentPiece();

    this._movementFrame = 0;
};

Tetris.prototype.getInterval = function() {
    return 50;
};

Tetris.prototype._nextCurrentPiece = function() {
    this._currentPiece = this._nextPiece;
    this._nextPiece = getRandomPiece();
    this._timings.pieceMovedDown();
    
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

Tetris.prototype._canTranslatePiece = function(piece, drow, dcol) {
    piece.savePositionTo(this._oldPosition);

    piece.translate(drow, dcol);
    var result = this._gameboard.hasValidPosition(piece);
 
    piece.restorePositionFrom(this._oldPosition);
    
    return result;
};

Tetris.prototype._tryTranslateCurrentPiece = function(drow, dcol) {
    if (this._canTranslatePiece(this._currentPiece, drow, dcol)) {
        this._currentPiece.translate(drow, dcol);
        return true;
    }
    else {
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

Tetris.prototype._saveCommand = function(ks) {
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
    ks.clear();
};

Tetris.prototype._getCommand = function() {
    var command = this._command;
    this._command = null;
    return command;
};

Tetris.prototype._hasHiddenParts = function(piece) {
    var box = piece.boundingBox();
    return (box.minRow < 0);
};

Tetris.prototype._tryLockCurrentPiece = function() {
    if (!this._canTranslatePiece(this._currentPiece, 1, 0)) {
        if (this._hasHiddenParts(this._currentPiece)) {
            // TODO: Game over
            console.log('game over!');
        }
        else {
            this._gameboard.addPiece(this._currentPiece);
            this._nextCurrentPiece();
            this._lockFor(500);
        }

        return true;
    }

    return false;
};

Tetris.prototype._getGhostPiece = function() {
    var ghostPiece = this._currentPiece.copy();

    while (this._canTranslatePiece(ghostPiece, 1, 0)) {
        ghostPiece.translate(1, 0);
    }

    return ghostPiece;
};

Tetris.prototype._moveCurrentPieceDown = function() {
    if (this._timings.shouldMovePieceDown()) {
        this._tryTranslateCurrentPiece(1, 0);
        this._timings.pieceMovedDown();
    }
};

Tetris.prototype._tryRemoveFullRow = function() {
    var fullRowRemoved = this._gameboard.removeFirstFullRow();

    if (fullRowRemoved !== null) {
        this._presenter.fullRowRemovedAnimation(
            fullRowRemoved.row, fullRowRemoved.colors);

        this._lockFor(1000);
        return true;
    }

    return false;
};

Tetris.prototype.run = function(driver, diffMs) {
    this._saveCommand(driver.keyboardState);
    this._timings.updateTime(diffMs);

    if (this._isLocked()) { return; }

    var command = this._getCommand();
    switch(command) {
        case 'left': case 'right':
            this._tryTranslateCurrentPiece(0, command === 'left' ? -1 : 1);
            break;

        case 'down':
            this._tryTranslateCurrentPiece(1, 0);
            break;

        case 'up':
            this._tryRotateCurrentPiece();
            break;

        case 'esc':
            driver.setModule('MainMenu');
            break;

        case 'space':
            this._presenter.fullRowRemovedAnimation(8, ['red', 'red', 'red',
            'blue', 'blue', 'blue', 'green', 'green']);
            break;
        // TODO: Pause
    }

    var rowRemoved = this._tryRemoveFullRow();
    if (!rowRemoved && !this._tryLockCurrentPiece()) {
        this._moveCurrentPieceDown();
        this._presenter.draw(this._getGhostPiece().getBlocks(), { ghost: true });
    }

    this._presenter.draw(this._currentPiece.getBlocks());
    this._presenter.draw(this._gameboard.getBlocks());

    this._presenter.swapBuffers();
};

exports.Tetris = Tetris;
