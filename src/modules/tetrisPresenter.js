'use strict';

var PresenterBase = require('modules/presenterBase.js').PresenterBase;

var TetrisPresenter = PresenterBase.extend(function(containerElement) {
    PresenterBase.call(this, containerElement, 'gameboard_template');

    this._gameboard = document.getElementById('gameboard');
    this._boxes = [];
    this._level = 0;

    this.init();
});

TetrisPresenter.prototype.init = function() {
    for (var i = 0; i < 8; i += 1) {
        var stone = document.createElement('div');
        stone.className = 'stone stone-green stone-0-' + i;
        this._gameboard.appendChild(stone);
        this._boxes.push(stone);
    }
};

TetrisPresenter.prototype.moveDown = function() {
    this._level += 1;
    for (var i = 0; i < 8; i += 1) {
        this._boxes[i].className = 'stone stone-green stone-' + this._level + '-' + i;
    }
};

TetrisPresenter.prototype.rotate = function() {
    var left = 100, top = 120;

    for (var i = 0; i < 8; i += 1) {
        var elementTop = this._boxes[i].offsetTop;
        var elementLeft = this._boxes[i].offsetLeft;
        this._boxes[i].style.transformOrigin = (left - elementLeft) + 'px ' + (top - elementTop) + 'px';
        this._boxes[i].style.transform = 'rotate(30deg)';
    }
};

TetrisPresenter.prototype.setLevel = function(level) {
    this._setElementText('levelDisplay', level.toString());
};

TetrisPresenter.prototype.setPoints = function(points) {
    this._setElementText('pointsDisplay', points.toString());
};

exports.TetrisPresenter = TetrisPresenter;
