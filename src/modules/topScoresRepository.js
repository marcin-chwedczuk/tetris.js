'use strict';

var cookies = require('utils/cookies.js');

var KEEP_MAX_N = 10;

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

    topScores = topScores.slice(0, KEEP_MAX_N);
    this._saveTopScores(topScores);
};

TopScoresRepository.prototype._saveTopScores = function(newTopScores) {
    cookies.setCookieValue(this._cookieName, newTopScores);
};

TopScoresRepository.prototype.canAddScore = function(points) {
    var topScores = this.getTopScores();

    if (topScores.length < KEEP_MAX_N) {
        return true;
    }   

    // list of scores is full
    var min = Number.MAX_VALUE;
    
    topScores.forEach(function(obj) {
        min = Math.min(min, obj.score);
    });

    return (min < points);
};

exports.TopScoresRepository = TopScoresRepository;

