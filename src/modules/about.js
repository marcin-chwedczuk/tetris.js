'use strict';

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

function AboutPresenter(containerElement) {
    this._container = containerElement;

    this._loadTemplate();
}

AboutPresenter.prototype._loadTemplate = function() {
    var templateHtml = document.getElementById('about_template').innerHTML;
    this._container.innerHTML = templateHtml;
};

exports.About = About;
