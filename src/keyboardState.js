/*jshint forin: false */
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

var WAIT_BEFORE_KEY_REPEAT_MS = 200/*miliseconds*/;

function KeyboardState() {
    this._hardwareState = Object.create(null);
    this._softwareState = Object.create(null);
}

KeyboardState.prototype.clear = function() {
    for (var keyId in this._softwareState) {
        this._softwareState[keyId] = false;   
    }
};

KeyboardState.prototype.refresh = function() {
    for (var keyId in this._hardwareState) {
        this._softwareState[keyId] = this._getSoftwareKeyStateFromHardware(keyId);
    }
};

KeyboardState.prototype._getSoftwareKeyStateFromHardware = function(keyId) {
    if (!(keyId in this._hardwareState)) {
        return false;
    }

    var keyState = this._hardwareState[keyId];
    if (!keyState.pressed) {
        return false;
    }

    // first press before REPATE_WAIT
    if (!keyState.cleared) {
        keyState.cleared = true;
        return true;
    }

    var diffMs = (new Date()).getTime() - keyState.timestamp;
    if (diffMs < WAIT_BEFORE_KEY_REPEAT_MS) {
        return false;
    }
    else {
        return true;
    }
};

KeyboardState.prototype._setHardwareKeyPressed = function(keyId, pressed) {
    var keyState = this._hardwareState[keyId] || {};

    if (!pressed) {
        keyState.pressed = false;
        keyState.timestamp = null;
        keyState.cleared = false;
    }
    else {
        var currentTimestamp = (new Date()).getTime();

        keyState.pressed = true;
        if (!keyState.timestamp) {
            keyState.timestamp = currentTimestamp;
        }
    }

    this._hardwareState[keyId] = keyState;
};

KeyboardState.prototype._isSoftwareKeyPressed = function(keyId) {
    return !!this._softwareState[keyId];
};

// create key accessors

/*jshint -W083*/ // disable dont create functions inside loop
for (var i = 0; i < KEYS.length; i += 1) {
    (function() {
        var keyId = KEYS[i];

        KeyboardState.prototype['is' + keyId + 'Pressed'] = function() {
            return this._isSoftwareKeyPressed(keyId);
        };

        KeyboardState.prototype['set' + keyId + 'Pressed'] = function(pressed) {
            return this._setHardwareKeyPressed(keyId, pressed);
        };
    })();
}
/*jshint +W083*/

exports.KeyboardState = KeyboardState;
