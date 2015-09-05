'use strict';

var Driver = require('./driver.js').Driver;
var Menu = require('./menu.js').Menu;

// on document ready:
document.addEventListener("DOMContentLoaded", function() { 
    var driver = new Driver();

    driver.init();
    driver.setModule(Menu);

    driver.start();
});
