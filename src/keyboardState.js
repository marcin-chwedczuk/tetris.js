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
    this._keyboardState = Object.create(null);
}

KeyboardState.prototype.clear = function() {
    // TODO: Clean up
};

KeyboardState.prototype._setKeyPressed = function(keyId, pressed) {
    this._keyboardState[keyId] = !!pressed;
};

KeyboardState.prototype._isKeyPressed = function(keyId) {
    return this._keyboardState[keyId] || false;
};

// create key accessors

/*jshint -W083*/ // disable dont create functions inside loop
for (var i = 0; i < KEYS.length; i += 1) {
    (function() {
        var keyId = KEYS[i];

        KeyboardState.prototype['is' + keyId + 'Pressed'] = function() {
            return this._isKeyPressed(keyId);
        };

        KeyboardState.prototype['set' + keyId + 'Pressed'] = function(pressed) {
            return this._setKeyPressed(keyId, pressed);
        };
    })();
}
/*jshint +W083*/

exports.KeyboardState = KeyboardState;
