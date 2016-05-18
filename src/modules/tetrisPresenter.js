/*jshint forin: false */
'use strict';

var PresenterBase = require('modules/presenterBase.js').PresenterBase;
var Set = require('utils/set.js');
var animationEvents = require('utils/animationEvents.js');

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
            blockElement = this._createElement(block.id());
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
        this._removeElement(id);
    });
};

TetrisPresenter.prototype.swap = function(blocks, callbackAnimationEnd) {
    var that = this;
    var oldElements = [];

    for (var i = 0; i < blocks.length; i += 1) {
        var block = blocks[i];
        var element = this._elements[block.id()];

        oldElements.push(element);
    }

    animationEvents.whenAnimationEndForAll(oldElements, function() {
        // remove old elemnts
        blocks.forEach(function(b) {
            that._removeElement(b.id());
        });

        var newElements = [];

        // apply animation when adding new elements as described in:
        // https://timtaubert.de/blog/2012/09/css-transitions-for-dynamically-created-dom-elements/
        blocks.forEach(function(b) {
            var element = that._createElement(b.id());
            that._updateElement(element, b);

            element.style.opacity = 0.7;
            // force browser engine to recompute styles
            /*jshint -W030 */
            window.getComputedStyle(element).opacity;

            newElements.push(element);
        });

        animationEvents.whenAnimationEndForAll(newElements, callbackAnimationEnd);

        // start animation
        newElements.forEach(function(el) {
            el.style.removeProperty('opacity');
        });
    });

    // start animation AFTER hooking events
    oldElements.forEach(function(el) {
        el.className += ' swap-hide';
    });
};

TetrisPresenter.prototype._createElement = function(id) {
    var stone = document.createElement('div');
    stone.className = 'stone stone-hidden';

    this._gameboard.appendChild(stone);
    this._elements[id] = stone;

    return stone;
};

TetrisPresenter.prototype._removeElement = function(id) {
    var element = this._elements[id];
    element.parentNode.removeChild(element);

    delete this._elements[id];
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
