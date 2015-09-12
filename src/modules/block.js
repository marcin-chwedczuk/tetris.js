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

Block.prototype.col = function() {
    return this._col;
};

Block.color = function() {
    return this._color;
};

module.exports = Block;
