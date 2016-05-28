'use strict';

var constants = require('modules/constants.js');

// var Set = require('utils/set.js');
// var Map = require('utils/map.js');

var PresenterBase = require('modules/presenterBase.js').PresenterBase;

var TetrisPresenter = PresenterBase.extend(function(containerElement) {
    PresenterBase.call(this, containerElement, 'gameboard_template');

    this._gameboard = document.getElementById('gameboard');

    this._gameboardWidth = constants.GAMEBOARD_WIDTH;
    this._gameboardHeight = constants.GAMEBOARD_VISIBLE_HEIGHT;

    this._blocks = null;
    this._currentBuffer = null;
    this._prevBuffer = null;
});

TetrisPresenter.prototype.init = function() {
    this._createElements();
    this._createBuffers();
};

TetrisPresenter.prototype._createElements = function() {
    var width = this._gameboardWidth;
    var height = this._gameboardHeight;

    var blocks = Array(height);

    for (var row = 0; row < height; row += 1) {
        var rowBlocks = Array(width);

        for (var col = 0; col < width; col += 1) {
            var block = this._createBlock(row, col);
            rowBlocks[col] = block;
            this._gameboard.appendChild(block);
        }

        blocks[row] = rowBlocks;
    }

    this._blocks = blocks;
};

TetrisPresenter.prototype._getBlockCssClass = function(row, col, color) {
    var colorClass = color ? 'stone-' + color : 'stone-hidden';
    var positionClass = 'stone-' + row + '-' + col;
    var cssClass = ['stone', positionClass, colorClass].join(' ');
    return cssClass;
};

TetrisPresenter.prototype._createBlock = function(row, col) {
    var div = document.createElement('div');
    div.className = this._getBlockCssClass(row, col, null);
    return div;
};

TetrisPresenter.prototype._createBuffers = function() {
    this._currentBuffer = this._createBuffer();
    this._prevBuffer = this._createBuffer();
};

TetrisPresenter.prototype._createBuffer = function() {
    var width = this._gameboardWidth;
    var height = this._gameboardHeight;
 
    var buffer = Array(height);

    for (var row = 0; row < height; row += 1) {
        var bufferRow = Array(width);

        for (var col = 0; col < width; col += 1) {
            bufferRow[col] = null;
        }

        buffer[row] = bufferRow;
    }

    return buffer;
};

TetrisPresenter.prototype._swapBuffers = function() {
    var tmp = this._currentBuffer;
    this._currentBuffer = this._prevBuffer;
    this._prevBuffer = tmp;
};

TetrisPresenter.prototype._clearCurrentBuffer = function() {
    for (var i = 0; i < this._currentBuffer.length; i += 1) {
        var row = this._currentBuffer[i];
        for (var j = 0; j < row.length; j += 1) {
            row[j] = null;
        }
    }
};

TetrisPresenter.prototype.swapBuffers = function() {
    for (var row = 0; row < this._gameboardHeight; row += 1) {
        for (var col = 0; col < this._gameboardWidth; col += 1) {
            if (this._currentBuffer[row][col] !== this._prevBuffer[row][col]) {

                var newCssClass = 
                    this._getBlockCssClass(row, col, this._currentBuffer[row][col]);

                this._blocks[row][col].className = newCssClass;

            }
        }
    }

    this._swapBuffers();
    this._clearCurrentBuffer();
};

TetrisPresenter.prototype.draw = function(blocks, options) {
    var buff = this._currentBuffer;
    var isGhost = options && options.ghost;
    
    for (var i = 0; i < blocks.length; i += 1) {
        var block = blocks[i];
    
        // cut hidden parts
        if (block.row() < 0) {
            continue;
        }

        var color = isGhost ? 'ghost-' + block.color() : block.color();
        buff[block.row()][block.col()] = color;
    }
};

TetrisPresenter.prototype.updateCurrent = function() {
};

TetrisPresenter.prototype.updateGameboard = function() {
};

TetrisPresenter.prototype.updateNext = function() {
};

TetrisPresenter.prototype.setLevel = function(level) {
    this._setElementText('levelDisplay', level.toString());
};

TetrisPresenter.prototype.setPoints = function(points) {
    this._setElementText('pointsDisplay', points.toString());
};

exports.TetrisPresenter = TetrisPresenter;
