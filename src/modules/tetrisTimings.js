'use strict';

module.exports = TetrisTimings;

function TetrisTimings() {
    // all times in miliseconds:
    this._pieceMoveDownTime = 900;
    this._pieceMoveDownCurrent = 0;
}

TetrisTimings.prototype.updateTime = function(diffMs) {
    this._pieceMoveDownCurrent += diffMs;
};

TetrisTimings.prototype.shouldMovePieceDown = function() {
    return (this._pieceMoveDownCurrent >= this._pieceMoveDownTime);
};

TetrisTimings.prototype.pieceMovedDown = function() {
    this._pieceMoveDownCurrent = 0;
};


