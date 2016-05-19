/*jshint forin: false */
'use strict';

var Set = require('utils/set.js');
var Map = require('utils/map.js');

var PresenterBase = require('modules/presenterBase.js').PresenterBase;
// var animationEvents = require('utils/animationEvents.js');

var TetrisPresenter = PresenterBase.extend(function(containerElement) {
    PresenterBase.call(this, containerElement, 'gameboard_template');

    this._gameboard = document.getElementById('gameboard');
    this._nextBlock = document.getElementById('nextBlockDisplay');
    this._objects = new Map();
    this._cache = [];
});

TetrisPresenter.prototype.init = function() {
};

TetrisPresenter.prototype.updateCurrent = function(currentPiece) {
    this._updateDom(this._gameboard,
                    'current',
                    currentPiece.getBlocks());
};

TetrisPresenter.prototype.updateGameboard = function(gameboard) {
    this._updateDom(this._gameboard,
                    'gameboard',
                     gameboard.getBlocks());
};

TetrisPresenter.prototype.updateNext = function(nextPiece) {
    this._updateDom(this._nextBlock,
                    'next',
                    nextPiece.getBlocks());

    this._centerNext(nextPiece);
};

TetrisPresenter.prototype._centerNext = function(nextPiece) {
    var blockElement = this._nextBlock.children[0];
    
    var blockWidth = blockElement.offsetWidth;
    var blockHeight = blockElement.offsetHeight;

    var width = blockWidth;
    var height = blockHeight;

    var box = nextPiece.boundingBox();

    width *= (box.maxCol - box.minCol + 1);
    height *= (box.maxRow - box.minRow + 1);

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

TetrisPresenter.prototype._updateDom = function(container, objectId, blocks) {
    var that = this;
    var idSet = new Set();

    var block2Element = this._objects.getOrCreate(objectId, function() { 
        return new Map();
    });
 
    blocks.forEach(function(block) {
        var blockElement = block2Element.getOrCreate(block.id(), function() {
            return that._createElement(container);
        });
        
        that._updateElement(blockElement, block);
        idSet.add(block.id());
    });

    var toRemove = new Set();
    block2Element.forEach(function(id) {
        if ( !idSet.contains(id) ) {
            toRemove.add(id);
        }
    });

    toRemove.forEach(function(id) {
        that._removeElement(block2Element.get(id));
        block2Element.remove(id);
    });
};

/*
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
            /*window.getComputedStyle(element).opacity;

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
};*/

TetrisPresenter.prototype._createElement = function(container) {
    var stone = this._cache.length ? 
        this._cache.shift() : document.createElement('div');
    stone.className = 'stone stone-hidden';

    container.appendChild(stone);
    return stone;
};

TetrisPresenter.prototype._removeElement = function(element) {
    element.parentNode.removeChild(element);

    element.removeAttribute('style');
    element.className = '';

    this._cache.push(element);
};

TetrisPresenter.prototype._updateElement = function(element, block) {
    var positionClass = 'stone-' + block.row() + '-' + block.col();
    var colorClass = 'stone-' + block.color();

    element.className = ['stone', positionClass, colorClass].join(' ');
};

TetrisPresenter.prototype.setLevel = function(level) {
    this._setElementText('levelDisplay', level.toString());
};

TetrisPresenter.prototype.setPoints = function(points) {
    this._setElementText('pointsDisplay', points.toString());
};

exports.TetrisPresenter = TetrisPresenter;
