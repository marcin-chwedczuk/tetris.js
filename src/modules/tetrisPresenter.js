/*jshint forin: false */
'use strict';

var Set = require('utils/set.js');
var Map = require('utils/map.js');

var PresenterBase = require('modules/presenterBase.js').PresenterBase;
var animationEvents = require('utils/animationEvents.js');

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

TetrisPresenter.prototype.rotateCurrent = function(blocks, onAnimationCompleted) {
    var that = this;

    var completedCount = 0;
    function checkCompleted() {
        if (2 === ++completedCount && onAnimationCompleted) {
            onAnimationCompleted();
        }
    }

    // hide old
    this._applyAnimation({
        objectId: 'current',
        container: this._gameboard,
        blocks: blocks,
        remove: true,

        setUp: function(element) {
            return (element.className.indexOf('swap-hide') === (-1));
        },

        start: function(element) {
            element.className += ' swap-hide';
        },

        onCompleted: checkCompleted
    });

    // show new
    this._applyAnimation({
        objectId: 'current',
        container: this._gameboard,
        blocks: blocks,

        setUp: function(element, block) {
            that._updateElement(element, block);

            element.style.opacity = 0.3;
            // force browser engine to recompute styles
            /*jshint -W030 */
            window.getComputedStyle(element).opacity;

            return true;
        },

        start: function(element) {
            element.style.removeProperty('opacity');
        },

        onCompleted: checkCompleted
    });
};

/** applyAnimation({
 *      objectId: 'foo',
 *      container: gameboard,
 *      blocks: blocks,
 *      remove: true/false,
 *
 *      // this function should return true
 *      // if element will be animated
 *      setUp: function(element, block) { ... },
 *      start: function(element, block) { ... },
 *
 *      onCompleted: function() { ... }
 *  });
 */
TetrisPresenter.prototype._applyAnimation = function(options) {
    var that = this;

    var block2Element = this._objects.getOrCreate(options.objectId, function() { 
        return new Map();
    });
 
    var animatedBlocks = [];

    options.blocks.forEach(function(block) {
        var element = block2Element.getOrCreate(block.id(), function() {
            return that._createElement(options.container);
        });

        if (options.setUp(element, block)) {
            animatedBlocks.push({ 
                block: block,
                element: element
            });
        }
    });

    if (options.remove) {
        animatedBlocks.forEach(function(pair) {
            block2Element.remove(pair.block.id());
        });
    }

    if (animatedBlocks.length) {
        animationEvents.whenAnimationEndForAll(
            animatedBlocks.map(function(pair) { return pair.element; }),
            function() {
                if (options.remove) {
                    animatedBlocks.forEach(function(pair) {
                        that._removeElement(pair.element);
                    });
                }

                if (options.onComplete) {
                    options.onComplete();
                }
            });

        animatedBlocks.forEach(function(pair) {
            options.start(pair.element, pair.block);
        });
    }
    else {
        if (options.onComplete) {
            setTimeout(options.onComplete, 0);
        }
    }
};

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
    var blockRow = (block.row() >= 0) ? 
        block.row() : 
        'm' + Math.abs(block.row());

    var positionClass = 'stone-' + blockRow + '-' + block.col();
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
