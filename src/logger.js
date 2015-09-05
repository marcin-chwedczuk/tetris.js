'use strict';

function Logger() {
    this._isActive = true;
}

Logger.prototype.disable = function() {
    this._isActive = false;
};

Logger.prototype.enable = function() {
    this._isActive = true;
};


// log.debug('{0}x{1} foo bar', 1, 2);
// 
Logger.prototype.debug = function() {
    if (!this._isActive || !arguments.length) {
        return;
    }

    var format = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);

    format = format.replace(/\{(\d+)\}/g, function(match, index) {
        var arg = args[index];
        
        // display complex objects as json
        if (!Array.isArray(arg) && typeof(arg) === 'object') {
            arg = JSON.stringify(arg);
        }

        return String(arg);
    });

    console.log(format);
};

exports.log = new Logger();
