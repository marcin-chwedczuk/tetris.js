'use strict';

var constants = require('modules/constants.js');

// two first rows of gameboard are hidden
// these are the place where new blocks appear
var WIDTH = constants.GAMEBOARD_WIDTH;
var HEIGHT = constants.GAMEBOARD_HIDDEN_HEIGHT + constants.GAMEBOARD_VISIBLE_HEIGHT;
var HIDDEN = constants.GAMEBOARD_HIDDEN_HEIGHT;

exports.Gameboard = Gameboard;

function Gameboard() {
    this._board = new Array(WIDTH*HEIGHT);
}

Gameboard.prototype._get = function(row, col) {
    return this._board[row*WIDTH + col];
};

Gameboard.prototype._set = function(row, col, value) {
    this._board[row*WIDTH + col] = value;
};

Gameboard.prototype.addBlock = function(block) {
    var row = block.row() + HIDDEN;
    var col = block.col();

    if (row < 0 || row >= HEIGHT) {
        throw new Error('invalid block row: ' + block.row());
    }

    if (col < 0 || col >= WIDTH) {
        throw new Error('invalid block col: ' + block.col());
    }

    this._set(block.row(), block.col(), block);
};

Gameboard.prototype.addPiece = function(piece) {
    piece.getBlocks().forEach(this.addBlock.bind(this));
};

Gameboard.prototype.getBlocks = function() {
    var blocks = [];

    this._board.forEach(function(place) {
        if (place) {
            blocks.push(place);
        }
    });

    return blocks;
};

Gameboard.prototype.width = function() {
    return WIDTH;
};

Gameboard.prototype.hiddenHeight = function() {
    return HIDDEN;
};

Gameboard.prototype._isOnBoard = function(row, col) {
    return (row >= -HIDDEN && row < (HEIGHT-HIDDEN)) &&
        (col >= 0 && col < WIDTH);
};

Gameboard.prototype._isEmpty = function(row, col) {
    return !this._get(row, col);
};

Gameboard.prototype.hasValidPosition = function(piece) {
    return piece.getBlocks().reduce(function(acc, curr) {
        return acc && 
            this._isOnBoard(curr.row(), curr.col()) &&
            this._isEmpty(curr.row(), curr.col());
    }.bind(this), true);
};
