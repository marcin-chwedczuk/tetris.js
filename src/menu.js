'use strict';

function Menu(containerElement) {
    this._presenter = new MenuPresenter(containerElement);
    this._menuItems = [];

    this._createMenu();
    this._currentIndex = 0;

    this._renderHtml();
}

Menu.prototype._createMenu = function() {
    this._addMenuItem('Play', function() {
        alert('play');
    });

    this._addMenuItem('Top Scores', function(driver) {
        driver.setModule('TopScores');
    });

    this._addMenuItem('Settings', function() {
        alert('settings');
    });

    this._addMenuItem('About', function() {
        alert('about');
    });

    this._addMenuItem('Exit', function() {
        // window.close() doesn't work in recent browsers
        // insted of closing game window we redirect user to
        // homepage
        window.location = '/';
    });
};

Menu.prototype._addMenuItem = function(caption, callback) {
    this._menuItems.push({
        caption: caption,
        callback: callback
    });
};

Menu.prototype._renderHtml = function() {
   this._presenter.setMenuItems(
        this._menuItems.map(function(item) {
            return item.caption;
        })
   );

    this._presenter.highlightMenuItem(this._currentIndex);
};

Menu.prototype.run = function(driver) {
    var ks = driver.keyboardState;
    var needsUpdate = true;

    if (ks.isUpArrowPressed()) {
        this._setCurrentIndex(this._currentIndex - 1);
    }
    else if (ks.isDownArrowPressed()) {
        this._setCurrentIndex(this._currentIndex + 1);
    }
    else if (ks.isEnterPressed()) {
        this._runCurrentOption(driver);
        needsUpdate = false;
    }
    else {
        needsUpdate = false;
    }

    if (needsUpdate) {
        this._presenter.highlightMenuItem(this._currentIndex);
    }

    ks.clear();
};

Menu.prototype._setCurrentIndex = function(newCurrentIndex) {
    if (newCurrentIndex < 0 || newCurrentIndex >= this._menuItems.length) {
        return;
    }
    else {
        this._currentIndex = newCurrentIndex;
    }
};

Menu.prototype._runCurrentOption = function(driver) {
    this._menuItems[this._currentIndex].callback(driver);
};

function MenuPresenter(containerElement) {
    this._container = containerElement;

    this._loadTemplate();
}

MenuPresenter.prototype._loadTemplate = function() {
    var templateHtml = document.getElementById('menu_template').innerHTML;
    this._container.innerHTML = templateHtml;
};

MenuPresenter.prototype.setMenuItems = function(menuItems) {
    var optionsList = 
        this._container.getElementsByClassName('menu-options')[0];

    // clear old items
    while (optionsList.firstChild) {
        optionsList.removeChild(optionsList.firstChild);
    }

    for (var i = 0; i < menuItems.length; i += 1) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(menuItems[i]));
        optionsList.appendChild(li);
    }
};

MenuPresenter.prototype.highlightMenuItem = function(index) {
    var menuItems = this._container.getElementsByTagName('li');

    for (var i = 0; i < menuItems.length; i += 1) {
        switch(i) {
        case (index+1):
        case (index-1):
            menuItems[i].className = 'surround-active';
            break;

        case (index):
            menuItems[i].className = 'active';
            break;

        default:
            menuItems[i].className = '';
            break;
        }
    }
};

exports.Menu = Menu;
