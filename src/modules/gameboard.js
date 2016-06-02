'use strict';

var constants = require('modules/constants.js');

// two first rows of gameboard are hidden
// these are the place where new blocks appear
var WIDTH = constants.GAMEBOARD_WIDTH;

var VISIBLE_HEIGHT = constants.GAMEBOARD_VISIBLE_HEIGHT;
var HIDDEN_HEIGHT = constants.GAMEBOARD_HIDDEN_HEIGHT;
var HEIGHT = VISIBLE_HEIGHT + HIDDEN_HEIGHT;

exports.Gameboard = Gameboard;

function Gameboard() {
    this._board = new Array(WIDTH*HEIGHT);
}

// row -HIDDEN_HEIGHT .. HEIGHT-HIDDEN_HEIGHT
Gameboard.prototype._get = function(row, col) {
    row += HIDDEN_HEIGHT;
    return this._board[row*WIDTH + col];
};

// row -HIDDEN_HEIGHT .. HEIGHT-HIDDEN_HEIGHT
Gameboard.prototype._set = function(row, col, value) {
    row += HIDDEN_HEIGHT;
    this._board[row*WIDTH + col] = value;
};

Gameboard.prototype.addBlock = function(block) {
    var row = block.row();
    var col = block.col();

    if (row < -HIDDEN_HEIGHT || row >= VISIBLE_HEIGHT) {
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
    return HIDDEN_HEIGHT;
};

Gameboard.prototype._isOnBoard = function(row, col) {
    return (row >= -HIDDEN_HEIGHT && row < VISIBLE_HEIGHT) &&
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

Gameboard.prototype._isRowFull = function(row) {
    for (var col = 0; col < WIDTH; col += 1) {
        if (this._isEmpty(row, col)) {
            return false;
        }
    }

    return true;
};

Gameboard.prototype._removeRow = function(rowIndex) {
    var col, row;

    for (row = rowIndex; row > 0; row -= 1) {
        // row[i] = row[i-1]
        for (col = 0; col < WIDTH; col += 1) {
            var block = this._get(row-1, col);
            if (block) {
                block.translate(1, 0);
            }
            this._set(row, col, block);
        }
    }

    // zero first row
    for (col = 0; col < WIDTH; col += 1) {
        this._set(0, col, null);
    }
};

Gameboard.prototype._getColorsInRow = function(row) {
    var colors = [];

    for (var col = 0; col < WIDTH; col += 1) {
        var block = this._get(row, col);
        colors.push(block.color());
    }

    return colors;
};

Gameboard.prototype.removeFirstFullRow = function() {
    // returns *number* of removed row e.g. 1st row or null
    // if no rows were removed
 
    for (var row = -HIDDEN_HEIGHT; row < VISIBLE_HEIGHT; row += 1) {
        if (this._isRowFull(row)) {
            
            var rowColors = this._getColorsInRow(row);
            this._removeRow(row);

            return { row:row, colors:rowColors };
        }
    }

    return null;
};

Gameboard.prototype.logToConsole = function() {
    var boardString = '';

    for (var row = -HIDDEN_HEIGHT; row < VISIBLE_HEIGHT; row += 1) {
        var rowString = ('000' + row).slice(-2) + '. |';

        for (var col = 0; col < WIDTH; col += 1) {
            rowString += this._get(row, col) ? '#' : ' ';
        }

        boardString += '\n' + rowString + '|';
    }

    console.log(boardString);
};
