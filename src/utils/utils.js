'use strict';

exports.extend = function(objectToExtend, source) {
    for (var propertyName in source) {
        if (Object.prototype.hasOwnProperty.call(source, propertyName)) {
            objectToExtend[propertyName] = source[propertyName];
        }
    }

    return objectToExtend;
};

exports.copyObject = function(objectToCopy) {
    var obj = {};

    for (var propertyName in objectToCopy) {
        if (Object.prototype.hasOwnProperty.call(objectToCopy, propertyName)) {
            obj[propertyName] = objectToCopy[propertyName];
        }
    }

    return obj;
};
