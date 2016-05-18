'use strict';

var KEYS = [
    'UpArrow',
    'DownArrow',
    'LeftArrow',
    'RightArrow',

    'Enter',
    'Escape',
    'Space'
];

function KeyboardState() {
    this.clear();
}

KeyboardState.prototype.clear = function() {
    this._keyboardState = {};
};

KeyboardState.prototype._setKeyPressed = function(keyId, isPressed) {
    this._keyboardState[keyId] = isPressed;
};

KeyboardState.prototype._isKeyPressed = function(keyId) {
    var state = this._keyboardState[keyId];
    return (state ? true : false);
};

// create key accessors

/*jshint -W083*/ // disable dont create functions inside loop
for (var i = 0; i < KEYS.length; i += 1) {
    (function() {
        var keyId = KEYS[i];

        KeyboardState.prototype['is' + keyId + 'Pressed'] = function() {
            return this._isKeyPressed(keyId);
        };

        KeyboardState.prototype['set' + keyId + 'Pressed'] = function(isPressed) {
            return this._setKeyPressed(keyId, isPressed);
        };
    })();
}
/*jshint +W083*/

exports.KeyboardState = KeyboardState;
