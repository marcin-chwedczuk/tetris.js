'use strict';

module.exports = LevelManager;

var DEBUG_LEVEL_UP = null;
var LEVEL_INFO = {
    1: {
        rowRemovedPoints: 1,
        rowsToLevelUp: DEBUG_LEVEL_UP || 50,
        levelUpBonus: 50,
        moveDownTime: 900
    },
    2: {
        rowRemovedPoints: 2,
        rowsToLevelUp: DEBUG_LEVEL_UP || 50,
        levelUpBonus: 80,
        moveDownTime: 670,
    },
    3: {
        rowRemovedPoints: 4,
        rowsToLevelUp: DEBUG_LEVEL_UP || 50,
        levelUpBonus: 100,
        moveDownTime: 400,
    },
    4: {
        rowRemovedPoints: 7,
        rowsToLevelUp: DEBUG_LEVEL_UP || 50,
        levelUpBonus: 130,
        moveDownTime: 200,
    },
    5: {
        rowRemovedPoints: 10,
        rowsToLevelUp: Number.MAX_VALUE,
        levelUpBonus: 0,
        moveDownTime: 100
    }
};

function LevelManager() {
    this._points = 0;
    this._rowsRemoved = 0;
    this._level = 1;

    this._pieceMoveDownCurrent = 0;
}

LevelManager.prototype.points = function() {
    return this._points;
};

LevelManager.prototype.level = function() {
    return this._level;
};

LevelManager.prototype.updateTime = function(diffMs) {
    this._pieceMoveDownCurrent += diffMs;
};

LevelManager.prototype.shouldMovePieceDown = function() {
    return (this._pieceMoveDownCurrent >= LEVEL_INFO[this._level].moveDownTime);
};

LevelManager.prototype.pieceMovedDown = function() {
    this._pieceMoveDownCurrent = 0;
};

LevelManager.prototype.addRowRemovedPoints = function() {
    var levelInfo = LEVEL_INFO[this._level];

    this._points += levelInfo.rowRemovedPoints;
    this._rowsRemoved += 1;

    if (this._rowsRemoved >= levelInfo.rowsToLevelUp) {
        this._levelUp();
    }
};

LevelManager.prototype._levelUp = function() {
    if (this._level < 5) {
        this._points += LEVEL_INFO[this._level].levelUpBonus;
        this._level++;
    }
};
