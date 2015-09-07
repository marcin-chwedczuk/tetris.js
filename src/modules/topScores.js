'use strict';

var TopScoresPresenter = require('modules/topScoresPresenter.js').TopScoresPresenter;
var TopScoresRepository = require('modules/topScoresRepository.js').TopScoresRepository;

function TopScores(containerElement) {
    this._repo = new TopScoresRepository();
    this._presenter = new TopScoresPresenter(containerElement, this._repo.getTopScores());
}

TopScores.prototype.run = function(driver) {
    var ks = driver.keyboardState;

    if (ks.isEscapePressed()) {
        driver.setModule('MainMenu');
    }   

    ks.clear();
};

exports.TopScores = TopScores;
