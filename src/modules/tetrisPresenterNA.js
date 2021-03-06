'use strict';

var constants = require('modules/constants.js');
var PresenterBase = require('modules/presenterBase.js').PresenterBase;
var StarAnimation = require('modules/starAnimation.js');

var TetrisPresenter = PresenterBase.extend(function(containerElement) {
    PresenterBase.call(this, containerElement, 'gameboard_template');

    this._gameboard = document.getElementById('gameboard');
    this._nextBlock = document.getElementById('nextBlockDisplay');
    this._infoScreen = document.getElementById('infoScreen');

    this._gameboardWidth = constants.GAMEBOARD_WIDTH;
    this._gameboardHeight = constants.GAMEBOARD_VISIBLE_HEIGHT;

    this._blocks = null;
    this._currentBuffer = null;
    this._prevBuffer = null;
});

TetrisPresenter.prototype.init = function() {
    this._createElements();
    this._createBuffers();

    var blockSize = this._getBlockSize();
    this._starAnimation = new StarAnimation(
        this._gameboard, 
        this._gameboardWidth * blockSize.width, 
        this._getBlockSize().height,
        this._gameboardWidth);

    this._starAnimation.init();
};

TetrisPresenter.prototype.destroy = function() {
    if (this._starAnimation) {
        this._starAnimation.destroy();
    }
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

TetrisPresenter.prototype.updateNext = function(piece) {
    var nextBlock = this._nextBlock;

    // remove all elements
    while (nextBlock.lastChild) {
        nextBlock.removeChild(nextBlock.lastChild);
    }

    // create element per block
    piece.getBlocks().forEach(function(b) {
        var blockElement = document.createElement('div');

        var positionClass = 'stone-' + b.row() + '-' + b.col();
        var colorClass = 'stone-' + b.color();

        blockElement.className = ['stone', positionClass, colorClass].join(' ');

        nextBlock.appendChild(blockElement);
    });

    this._centerNextPiece(piece);
};

TetrisPresenter.prototype._getBlockSize = function() {
    var blockElement = this._gameboard.children[0];
    
    var blockWidth = blockElement.offsetWidth;
    var blockHeight = blockElement.offsetHeight;

    return { width: blockWidth, height: blockHeight };
};

TetrisPresenter.prototype._centerNextPiece = function(nextPiece) {
    var blockElement = this._nextBlock.children[0];
    
    var blockWidth = blockElement.offsetWidth;
    var blockHeight = blockElement.offsetHeight;

    var width = blockWidth;
    var height = blockHeight;

    var box = nextPiece.boundingBox();

    width *= box.width();
    height *= box.height();

    var parent = this._nextBlock.parentNode;
    var bannerHeight = 
        parent.getElementsByTagName('span')[0].offsetHeight;

    var parentWidth = parent.clientWidth;
    var parentHeight = parent.clientHeight - bannerHeight;

    this._nextBlock.style.top = 
        Math.round(bannerHeight + (parentHeight - height)/2) + 'px';

    this._nextBlock.style.left = 
        Math.round((parentWidth - width)/2) + 'px';
};

TetrisPresenter.prototype.setLevel = function(level) {
    this._setElementText('levelDisplay', level.toString());
};

TetrisPresenter.prototype._formatPoints = function(points) {
   // number in format: ### ### ###
    var pointsString = points.toString();

    var formatted = pointsString.
        replace(/^(\d{0,3})(\d{3})?(\d{3})$/g, '$1 $2 $3').
        replace('  ', ' ');

    return formatted;
};

TetrisPresenter.prototype.setPoints = function(points) {
    var formatted = this._formatPoints(points);
    this._setElementText('pointsDisplay', formatted);
};

TetrisPresenter.prototype.fullRowRemovedAnimation = function(row, colors) {
    this._starAnimation.start(row, colors);
};

TetrisPresenter.prototype.showGameOverScreen = function(points) {
    var message = 'GAME OVER!\n' + this._formatPoints(points) +  ' POINTS';
    this.showInfoScreen(message);
};

TetrisPresenter.prototype.showInfoScreen = function(message) {
    var span = this._infoScreen.children[0];
    span.innerHTML = message.replace(/\r?\n/g, '<br>');
    this._infoScreen.className = 'infoScreen-show';
};

TetrisPresenter.prototype.hideInfoScreen = function() {
    if (this._infoScreen.className) {
        this._infoScreen.className = '';
    }
};

exports.TetrisPresenter = TetrisPresenter;
