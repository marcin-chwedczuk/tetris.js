'use strict';

var BoundingBox = require('utils/boundingBox.js');

module.exports = Particle;

function Particle(options) {
    this._position = options.position;
    this._velocity = options.velocity;
    this._rotationSpeed = options.rotation;
    this._acceleration = { top: 0, left: 0 };
    this._element = options.element;
    this._delayMs = options.delayMs;
    this._color = options.color;
    this._bounceBox = options.bounceBox;

    this._timeToLive = options.timeToLiveSeconds * 1000;
    this._creationTime = (new Date()).getTime();
    this._lastTime = this._creationTime;

    this._size = 0;
    this._rotation = 0;
}

Particle.prototype.init = function() {
    this._element.className = 'particle particle-' + this._color;
    this._updateElement();
};

Particle.prototype.destroy = function() {
    this._element.parentElement.removeChild(this._element);
    this._element = null;
};

// return false to remove particle
Particle.prototype.update = function() {
    var currTime = (new Date()).getTime();

    var elapsed = (currTime - this._creationTime);
    if (this._delayMs !== null && elapsed < this._delayMs) { return true; }
    if (this._delayMs !== null) {
        this._creationTime = currTime;
        elapsed = 0;
        this._delayMs = null;
    }

    if (elapsed >= this._timeToLive) { return false; }

    var diffMs = currTime - this._lastTime;
    this._lastTime = currTime;

    var percentage = Math.min(100.0, elapsed * 100 / this._timeToLive);

    this._animate(percentage, diffMs);
    this._updateElement();

    return true;
};

Particle.prototype._getBoundingBox = function(rotationDeg) {
    var rotation = Math.PI*rotationDeg/180.0;

    var cos = Math.cos(rotation),
        sin = Math.sin(rotation),
        size2 = this._size/2;

    var vertices = [
        -size2, size2,
        size2, size2,
        size2, -size2,
        -size2, -size2
    ];

    var minX = 9999, maxX = 0, minY = 9999, maxY = 0;
    
    for (var i = 0; i < vertices.length; i += 2) {
        var rx = cos*vertices[i] - sin*vertices[i+1];
        var ry = sin*vertices[i] + cos*vertices[i+1];

        minX = Math.min(minX, rx); maxX = Math.max(maxX, rx);
        minY = Math.min(minY, ry); maxY = Math.max(maxY, ry);
    }

    return new BoundingBox(
        minX, 
        maxX, 
        minY, 
        maxY);
};

Particle.prototype._shouldBounceFromWall = function() {
    var box = this._getBoundingBox(this._rotation);

    var rotatedWidth2 = box.width()/2;

    // transform must have origin: 50% 50%
    var centerLeft = this._position.left + this._size/2;

    if (centerLeft-rotatedWidth2 < this._bounceBox.minLeft) {
        return '->';
    }

    if (centerLeft+rotatedWidth2 > this._bounceBox.maxLeft) {
        return '<-';
    }

    return false;
};

Particle.prototype._animate = function(percentage, diffMs) {
    var speedFactor = 2.5;
    var diffS = speedFactor * diffMs / 1000;

    // drop in gravitation field
    var G_FORCE = 120.0;
 
    // bouncing from walls
    var shouldBounce = this._shouldBounceFromWall();
    if (!this._isBouncing && shouldBounce) {
        this._velocity.left = (shouldBounce === '->') ? 
            Math.abs(this._velocity.left) : 
            -Math.abs(this._velocity.left);
        this._isBouncing = true;
    }
    else if (!shouldBounce) {
        this._isBouncing = false;
    }

    this._position.top += this._velocity.top * diffS;
    this._position.left += this._velocity.left * diffS;
    
    this._velocity.top += this._acceleration.top * diffS;
    this._velocity.left += this._acceleration.left * diffS;
  
    this._acceleration.top += G_FORCE * diffS;

    // rotation and size
    var MAX_SIZE = 40;
    this._size = MAX_SIZE;

    this._rotation = (percentage/100)*360*this._rotationSpeed;
};

Particle.prototype._updateElement = function() {
    this._element.style.top = this._position.top + 'px';
    this._element.style.left = this._position.left + 'px';
    this._element.style.width = this._size + 'px';
    this._element.style.height = this._size + 'px';

    this._setTransform('rotate(' + Math.round(this._rotation) + 'deg)');
};

Particle.prototype._setTransform = function(transform) {
    this._element.style.webkitTransform = transform;
    this._element.style.MozTransform = transform;
    this._element.style.msTransform = transform;
    this._element.style.OTransform = transform;
    this._element.style.transform = transform;
};




