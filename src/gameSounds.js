'use strict';

var audioPlayer = require('utils/audioPlayer.js');
var gameSettings = require('gameSettings.js');

var play = function(assetName) {
    if (!gameSettings.isAudioEnabled()) {
        return;
    }

    audioPlayer.play(assetName);
};

exports.playHighlightMenuOption = function() {
    play('select_menu');
};

exports.playCannotHighlightMenuOption = function() {
    play('cannot_select_menu');
};

exports.playMenuOptionSelected = function() {
    play('menu_selected');
};
