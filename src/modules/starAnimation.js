'use strict';

var Particle = require('modules/particle.js');
var COLORS = require('modules/colors.js');

module.exports = StarAnimation;

function StarAnimation(gameboard, gameboardWidth, rowHeight) {
    this._gameboard = gameboard;
    this._gameboardWidth = gameboardWidth;
    this._rowHeight = rowHeight;

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

StarAnimation.prototype.start = function(rowNumber) {
    var numberOfStars = this._getNumberOfStars();
    
    var stars = this._createStarParticles(numberOfStars, rowNumber);
    Array.prototype.push.apply(this._animatedElements, stars);
};

StarAnimation.prototype._getNumberOfStars = function() {
    return 40;
};

StarAnimation.prototype._createStarParticles= function(count, row) {
    var birthArea = this._getBirthArea(row);

    var starsParticles = [];

    for (var i = 0; i < count; i += 1) {
        var starParticle = this._createStarParticle(birthArea);
        starsParticles.push(starParticle);
    }

    return starsParticles;
};

StarAnimation.prototype._getBirthArea = function(row) {
    var area = {
        top: (this._rowHeight * row),
        left: 0,

        width: this._gameboardWidth,
        height: this._rowHeight
    };

    return area;
};

StarAnimation.prototype._getRandomVelocity = function() {
    var dir = (Math.random() > 0.5) ? 1 : -1;
    return {
        left: dir * (10+Math.random()*50),
        top: -(40+Math.random()*60)
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

StarAnimation.prototype._createStarParticle = function(birthArea) {
    var position = {
        top: (birthArea.top + Math.random()*birthArea.height),
        left: (birthArea.left + Math.random()*birthArea.width)
    };

    var velocity = this._getRandomVelocity();
    var rotation = this._getRandomRotation();
    var element = this._createStarParticleElement();

    var starParticle = new Particle({
        position: position,
        velocity: velocity,
        rotation: rotation,
        element: element,
        color: COLORS.getRandom(),
        timeToLiveSeconds: 4,
        delayMs: 1000*Math.random()
    });

    starParticle.init();
    this._gameboard.appendChild(element);

    return starParticle;
};

