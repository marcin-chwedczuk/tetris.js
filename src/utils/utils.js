'use strict';

exports.extend = function(objectToExtend, source) {
    for (var propertyName in source) {
        if (Object.prototype.hasOwnProperty.call(source, propertyName)) {
            objectToExtend[propertyName] = source[propertyName];
        }
    }

    return objectToExtend;
};
