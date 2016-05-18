/*jshint forin: false */
'use strict';

var PresenterBase = require('modules/presenterBase.js').PresenterBase;
var Set = require('utils/set.js');

var TetrisPresenter = PresenterBase.extend(function(containerElement) {
    PresenterBase.call(this, containerElement, 'gameboard_template');

    this._gameboard = document.getElementById('gameboard');
    this._elements = Object.create(null);
});

TetrisPresenter.prototype.init = function() {
    for (var i = 0; i < 8; i += 1) {
        var stone = document.createElement('div');
        stone.className = 'stone stone-green stone-0-' + i;
        this._gameboard.appendChild(stone);
    }
};

TetrisPresenter.prototype.draw = function(blocks) {
    var idSet = new Set();

    // update or add block div's
    for (var i = 0; i < blocks.length; i += 1) {
        var block = blocks[i],
            blockElement;

        if ( !(block.id() in this._elements) ) {
            blockElement = this._createElement();
            this._elements[block.id()] = blockElement;
        }
        else {
            blockElement = this._elements[block.id()];
        }

        this._updateElement(blockElement, block);
        idSet.add(block.id());
    }

    var toRemove = new Set();
    for (var id in this._elements) {
        if ( !idSet.contains(id) ) {
            toRemove.add(id);
        }
    }

    toRemove.forEach(function (id) {
        this._removeElement(this._elements[id]);
        delete this._elements[id];
    });
};

TetrisPresenter.prototype._createElement = function() {
    var stone = document.createElement('div');
    stone.className = 'stone stone-hidden';

    this._gameboard.appendChild(stone);

    return stone;
};

TetrisPresenter.prototype._removeElement = function(element) {
    element.parentNode.removeChild(element);
};

TetrisPresenter.prototype._updateElement = function(element, block) {
    var positionClass = 'stone-' + block.row() + '-' + block.col();
    var colorClass = 'stone-' + block.color();

    element.className = ['stone', positionClass, colorClass].join(' ');
};

TetrisPresenter.prototype.moveDown = function() {
};

TetrisPresenter.prototype.rotate = function() {
};

TetrisPresenter.prototype.setLevel = function(level) {
    this._setElementText('levelDisplay', level.toString());
};

TetrisPresenter.prototype.setPoints = function(points) {
    this._setElementText('pointsDisplay', points.toString());
};

exports.TetrisPresenter = TetrisPresenter;
