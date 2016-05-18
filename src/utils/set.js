/*jshint forin: false */

'use strict';

function Set() {
    this._data = Object.create(null);
}

Set.prototype.add = function(item) {
    this._data[item] = true;
};

Set.prototype.contains = function(item) {
    return (this._data[item] === true);
};

Set.prototype.forEach = function(fn) {
    for (var prop in this._data) {
        fn(prop);
    }
};

module.exports = Set;
