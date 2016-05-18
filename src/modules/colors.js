'use strict';

var utils = require('utils/utils.js');

var COLORS = { };

var _colors = ['blue', 'gray', 'green', 'orange', 'purple', 'red'];

_colors.forEach(function(color) {
    COLORS[color.toUpperCase()] = color.toLowerCase();
});

COLORS.getRandom = function getRandom() {
    return COLORS[utils.getRandomElement(_colors).toUpperCase()];
};

module.exports = Object.freeze(COLORS);
