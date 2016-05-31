'use strict';

module.exports = Particle;

function Particle(options) {
    this._position = options.position;
    this._velocity = options.velocity;
    this._rotationSpeed = options.rotation;
    this._acceleration = { top: 0, left: 0 };
    this._element = options.element;
    this._delayMs = options.delayMs;
    this._color = options.color;

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

Particle.prototype._animate = function(percentage, diffMs) {
    var diffS = diffMs / 1000;

    // drop in gravitation field
    var G_FORCE = 120.0;
    
    this._position.top += this._velocity.top * diffS;
    this._position.left += this._velocity.left * diffS;

    this._velocity.top += this._acceleration.top * diffS;
    this._velocity.left += this._acceleration.left * diffS;

    this._acceleration.top += G_FORCE * diffS;

    // rotation and size
    var MAX_SIZE = 64;
    this._size = (percentage < 10) ? (percentage / 10)*MAX_SIZE :
                 (percentage > 80) ? ((100 - percentage)/20)*MAX_SIZE :
                 MAX_SIZE;

    this._rotation = (percentage/100)*360*this._rotationSpeed;
};

Particle.prototype._updateElement = function() {
    this._element.style.top = this._position.top - this._size/2 + 'px';
    this._element.style.left = this._position.left - this._size/2 + 'px';
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




