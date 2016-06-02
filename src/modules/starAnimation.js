'use strict';

var Particle = require('modules/particle.js');

module.exports = StarAnimation;

function StarAnimation(gameboard, gameboardWidth, blockSize, columns) {
    this._gameboard = gameboard;
    this._gameboardWidth = gameboardWidth;
    this._blockSize = blockSize;
    this._gameboardColumns = columns;

    this._animatedElements = [];
    this._intervalId = null;
}

StarAnimation.prototype.init = function() {
    if (this._intervalId) {
        throw new Error('StarAnimation was already initialized!');
    }

    this._intervalId = setInterval(this._animate.bind(this), 15);
};

StarAnimation.prototype.destroy = function() {
    if (this._intervalId) {
        clearInterval(this._intervalId);

        for (var i = 0; i < this._animatedElements.length; i += 1) {
            this._animatedElements[i].destroy();
        }

        this._intervalId = null;
    }
};

StarAnimation.prototype._animate = function() {
    var i,
        toDelete = null;

    for (i = 0; i < this._animatedElements.length; i += 1) {
        if (!this._animatedElements[i].update()) {
            if (toDelete === null) {
                toDelete = [];
            }
            toDelete.push(i);
        }
    }

    if (toDelete) {
        // remove in reverse order to preserve indexes
        for (i = toDelete.length-1; i >= 0; i -= 1) {
            this._animatedElements[i].destroy();
            this._animatedElements.splice(i, 1);
        }
    }
};

StarAnimation.prototype.start = function(rowNumber, blockColors) {
    var stars = this._createStarParticles(rowNumber, blockColors);
    Array.prototype.push.apply(this._animatedElements, stars);
};

StarAnimation.prototype._createStarParticles = function(row, colors) {
    var starsParticles = [];

    // create one paritcle per removed block
    for (var col = 0; col < this._gameboardColumns; col += 1) {
        var starParticle = this._createStarParticle(row, col, colors[col]);
        starsParticles.push(starParticle);
    }

    return starsParticles;
};

StarAnimation.prototype._getRandomVelocity = function() {
    var dir = (Math.random() > 0.5) ? 1 : -1;
    return {
        left: dir * (10+Math.random()*50),
        top: -(60+Math.random()*60)
    };
};

StarAnimation.prototype._createStarParticleElement = function() {
    var element = document.createElement('div');
    return element;
};

StarAnimation.prototype._getRandomRotation = function() {
    var rotation = 1.5 + 2*(Math.random()-0.5);
    return (Math.random() < 0.5) ? rotation : -rotation;
};

StarAnimation.prototype._createStarParticle = function(row, col, color) {
    var position = {
        top: this._blockSize*row,
        left: this._blockSize*col
    };

    var velocity = this._getRandomVelocity();
    var bounceBox = { minLeft: 0, maxLeft: this._gameboardWidth };

    var rotation = this._getRandomRotation();
    var element = this._createStarParticleElement();

    var starParticle = new Particle({
        position: position,
        velocity: velocity,
        bounceBox: bounceBox,
        rotation: rotation,
        element: element,
        color: color,
        timeToLiveSeconds: 4,
        delayMs: 0 // 1000*Math.random()
    });

    starParticle.init();
    this._gameboard.appendChild(element);

    return starParticle;
};

