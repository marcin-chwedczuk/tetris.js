'use strict';

var PresenterBase = require('modules/presenterBase.js').PresenterBase;

function About(containerElement) {
    this._presenter = new AboutPresenter(containerElement);
}

About.prototype.run = function(driver) {
    var ks = driver.keyboardState;

    if (ks.isEscapePressed()) {
        driver.setModule('MainMenu');
    }   

    ks.clear();
};

var AboutPresenter = PresenterBase.extend(function(containerElement) {
    PresenterBase.call(this, containerElement, 'about_template');
});

exports.About = About;
