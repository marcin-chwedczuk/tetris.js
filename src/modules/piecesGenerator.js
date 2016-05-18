'use strict';

var PIECES = require('modules/pieces.js');
var utils = require('utils/utils.js');

var cache = [];

function getRandomPiece() {
    if (!cache.length) {
        cache.push.apply(cache, PIECES.getPiecesNames());
        utils.permutate(cache);
    }

    var pieceType = cache.shift();
    return PIECES.createPiece(pieceType);
}

exports.getRandomPiece = getRandomPiece;
