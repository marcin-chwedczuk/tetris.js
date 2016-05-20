'use strict';

var getNextId = (function() {
    var blockIdGen = 1000;

    return function() {
        blockIdGen += 1;
        return blockIdGen;
    };
}());

function Block(options) {
    if (!options) {
        throw new Error('Block: missing argument options');
    }

    this._id = getNextId();
    this._row = options.row || 0;
    this._col = options.col || 0;
    this._color = options.color;
}

Block.prototype.id = function() {
    return this._id;
};

Block.prototype.row = function() {
    return this._row;
};

Block.prototype.setRow = function(row) {
    this._row = row;
};

Block.prototype.col = function() {
    return this._col;
};

Block.prototype.setCol = function(col) {
    this._col = col;
};

Block.prototype.color = function() {
    return this._color;
};

Block.prototype.setColor = function(color) {
    this._color = color;
};

Block.prototype.copy = function() {
    return new Block({
        row: this._row,
        col: this._col,
        color: this._color
    });
};

Block.prototype.translate = function(drow, dcol) {
    this._row += drow;
    this._col += dcol;
};

module.exports = Block;
