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
    var obj = Array.isArray(objectToCopy) ? [] : {};

    for (var propertyName in objectToCopy) {
        if (Object.prototype.hasOwnProperty.call(objectToCopy, propertyName)) {
            obj[propertyName] = objectToCopy[propertyName];
        }
    }

    return obj;
};

exports.getRandomElement = function(array) {
    var choosen = array[0];

    for (var i = 1; i < array.length; i += 1) {
        if ( Math.random() < (1/(i+1)) ) {
            choosen = array[i];
        }
    }

    return choosen;
};

exports.permutate = function(array) {
    var len = array.length;

    for (var i = 0; i < len-1; i += 1) {
        // swap array[i] with array[randomIndex]
        var swapIndex = i + Math.floor(Math.random() * (len-i));
        var swap = array[i]; array[i] = array[swapIndex]; array[swapIndex] = swap;
    }
};

