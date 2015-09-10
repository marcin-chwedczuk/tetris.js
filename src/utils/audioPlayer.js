'use strict';

var log = require('utils/logger.js').log;
 
var pageUrl = document.location.href;
pageUrl.replace(/tetris\.js[\/]$/, '');

if (!/[\/]$/.test(pageUrl)) {
    pageUrl += '/';
}

exports.play = function(assetName) {
    var audioUrl = pageUrl + 'assets/' + assetName + '.ogg';

    try {
        var audio = new Audio(audioUrl);
        audio.volume = 1;
        audio.play();
    }
    catch(e) {
        log.error('Error playing audio file: {0}. Error: {1}', audioUrl, e);
    }
};
