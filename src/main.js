'use strict';

var Driver = require('driver.js').Driver;
var TopScoresRepository = require('modules/topScoresRepository.js').TopScoresRepository;

// TEST ONLY - ADD FAKE TOP SCORE
var tsr = new TopScoresRepository();
if (!tsr.getTopScores().length) {
    tsr.addTopScore('foo', 32423);
    tsr.addTopScore('mc', 100);
    tsr.addTopScore('fijut', 32);
    tsr.addTopScore('dziedzic pruski', 32432);
    for (var i = 0; i< 20; i += 1) {
        tsr.addTopScore('user ' + i, i);
    }
}

// on document ready:
document.addEventListener("DOMContentLoaded", function() {
    if (true) {
    var driver = new Driver();

    driver.init();
    driver.setModule('MainMenu');

    driver.start();
    }
});
