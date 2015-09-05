'use strict';

function Menu(containerElement) {
    this._presenter = new MenuPresenter(containerElement);

    this._presenter.setMenuItems([
        'Play',
        'Top Scores',
        'Settings',
        'About',
        'Exit'
    ]);

    this._currentIndex = 0;
    this._presenter.highlightMenuItem(this._currentIndex);
}

Menu.prototype.run = function(driver) {
    var ks = driver.keyboardState;
    var needsUpdate = true;

    if (ks.isUpArrowPressed()) {
        this._currentIndex -= 1;
    }
    else if (ks.isDownArrowPressed()) {
        this._currentIndex += 1;
    }
    else {
        needsUpdate = false;
    }

    if (needsUpdate) {
        this._presenter.highlightMenuItem(this._currentIndex);
    }

    ks.clear();
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
