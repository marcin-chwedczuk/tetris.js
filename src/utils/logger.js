'use strict';

var LOG_LEVEL = {
    DEBUG: 0,
    ERROR: 1
};

function Logger() {
    this._isActive = true;

    this._logDebug = console.log.bind(console);
    this._logError = (console.error ? 
                      console.error.bind(console) : 
                      console.log.bind(console));
}

Logger.prototype.disable = function() {
    this._isActive = false;
};

Logger.prototype.enable = function() {
    this._isActive = true;
};

Logger.prototype._log = function(level, args) {
    if (!this._isActive || !args.length) {
        return;
    }

    var format = args[0];
    args = Array.prototype.slice.call(args, 1);

    // format a'la .NET format string 'foo: {0} bar: {1}'
    format = format.replace(/\{(\d+)\}/g, function(match, index) {
        var arg = args[index];
        
        // display complex objects as json
        if (!Array.isArray(arg) && typeof(arg) === 'object') {
            arg = JSON.stringify(arg);
        }

        return String(arg);
    });

    switch(level) {
    case LOG_LEVEL.ERROR:
        this._logError(format);
        break;

    default:
        this._logDebug(format);
        break;
    }
};

Logger.prototype.debug = function() {
    this._log(LOG_LEVEL.DEBUG, arguments);
};

Logger.prototype.error = function() {
    this._log(LOG_LEVEL.ERROR, arguments);
};

exports.log = new Logger();
