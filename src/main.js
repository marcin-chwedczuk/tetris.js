'use strict';

var Driver = require('driver.js').Driver;

// on document ready:
document.addEventListener("DOMContentLoaded", function() {
    if (true) {
    var driver = new Driver();

    driver.init();
    driver.setModule('MainMenu');

    driver.start();
    }
});
