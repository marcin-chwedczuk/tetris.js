'use strict';

var PresenterBase = require('modules/presenterBase.js').PresenterBase;

var TopScoresPresenter = PresenterBase.extend(function(containerElement, topScores) {
    PresenterBase.call(this, containerElement, 'topScores_template');

    this._displayTopScores(topScores);
});

TopScoresPresenter.prototype._displayTopScores = function(topScores) {
    var tbody = this._container.getElementsByTagName('tbody')[0];

    for (var i = 0; i < topScores.length; i += 1) {
        this._addTopScore(tbody, i, topScores.length-1, topScores[i]);
    }
};

TopScoresPresenter.prototype._addTopScore = function(tbody, index, maxIndex, topScore) {
    // 0 is for thead tr
    var row = tbody.insertRow(index);

    row.insertCell(0).appendChild(document.createTextNode(String(index+1)));
    row.insertCell(1).appendChild(document.createTextNode(topScore.user));
    row.insertCell(2).appendChild(document.createTextNode(String(topScore.score)));

    var saturation = (80 - Math.floor(80 * Math.pow(index/maxIndex, 2))) + 20;
    row.style.color = 'hsl(23, ' + saturation + '%, 48%)';
};

exports.TopScoresPresenter = TopScoresPresenter;
