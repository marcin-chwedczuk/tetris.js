/*jshint forin: false */

'use strict';

function Map() {
    this._data = Object.create(null);
}

Map.prototype.put = function(key, value) {
    this._data[key] = value;
};

Map.prototype.contains = function(key) {
    return (key in this._data);
};

Map.prototype.get = function(key) {
    if (this.contains(key)) {
        return this._data[key];
    }
    else {
        return undefined;
    }
};

Map.prototype.remove = function(key) {
    delete this._data[key];
};

Map.prototype.getOrCreate = function(key, valueFactory) {
    if (!this.contains(key)) {
        this.put(key, valueFactory(key));
    }

    return this.get(key);
};

Map.prototype.forEach = function(fn) {
    for (var key in this._data) {
        if (Object.prototype.hasOwnProperty.call(this._data, key)) {
            fn(key, this._data[key]);
        }
    }
};

module.exports = Map;
