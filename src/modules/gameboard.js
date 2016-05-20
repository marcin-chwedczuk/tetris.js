'use strict';

// two first rows of gameboard are hidden
// these are the place where new blocks appear
var WIDTH = 10;
var HEIGHT = 22;
var HIDDEN = 2;

exports.Gameboard = Gameboard;

function Gameboard() {
    this._board = new Array(WIDTH*HEIGHT);
}

Gameboard.prototype.addBlock = function(block) {
    var row = block.row() + HIDDEN;
    var col = block.col();

    if (row < 0 || row >= HEIGHT) {
        throw new Error('invalid block row: ' + block.row());
    }

    if (col < 0 || col >= WIDTH) {
        throw new Error('invalid block col: ' + block.col());
    }

    this._board[block.row()*WIDTH + block.col()] = block;
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
