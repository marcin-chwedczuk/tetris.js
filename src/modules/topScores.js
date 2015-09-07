'use strict';

var cookies = require('./../utils/cookies.js');

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

function TopScoresPresenter(containerElement, topScores) {
    this._container = containerElement;

    this._loadTemplate();
    this._displayTopScores(topScores);
}

TopScoresPresenter.prototype._loadTemplate = function() {
    var templateHtml = document.getElementById('topScores_template').innerHTML;
    this._container.innerHTML = templateHtml;
};

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

function TopScoresRepository() {
    this._cookieName = 'top-scores';
}

TopScoresRepository.prototype.getTopScores = function() {
    return cookies.getCookieValue(this._cookieName, []);
};

TopScoresRepository.prototype.addTopScore = function(user, score) {
    var topScores = this.getTopScores();
 
    topScores.push({ user:user, score:score, date:(new Date()).getTime() });
    
    // sort in DESC order
    topScores.sort(function(l, r) {
        if (l.score !== r.score) {
            return -(l.score - r.score);
        }

        // older scores are earlier in the list
        return (l.date - r.date);
    });

    topScores = topScores.slice(0, 10);
    this._saveTopScores(topScores);
};

TopScoresRepository.prototype._saveTopScores = function(newTopScores) {
    cookies.setCookieValue(this._cookieName, newTopScores);
};

exports.TopScoresRepository = TopScoresRepository;
exports.TopScores = TopScores;
