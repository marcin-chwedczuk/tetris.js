'use strict';

module.exports = BoundingBox;

function BoundingBox(minRow, maxRow, minCol, maxCol) {
    this.minRow = minRow;
    this.maxRow = maxRow;

    this.minCol = minCol;
    this.maxCol = maxCol;
}

BoundingBox.prototype.width = function() {
    return (this.maxCol - this.minCol + 1);
};

BoundingBox.prototype.height = function() {
    return (this.maxRow - this.minRow + 1);
};
