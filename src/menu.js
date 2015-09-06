'use strict';

function Menu(containerElement, templateName) {
    this._presenter = new MenuPresenter(containerElement, templateName);
    this._menuItems = [];

    this._createMenu();
    this._currentIndex = 0;

    this._renderHtml();
}

Menu.prototype.addButton = function(caption, callback, optionsOpt) {
    var cssClass = (optionsOpt && optionsOpt.cssClass) || null;

    this._menuItems.push({
        caption: caption,
        callback: callback,
        isCheckbox: false,
        cssClass: cssClass 
    });
};

Menu.prototype.addCheckbox = function(caption, initialState, callback) {
    var menuItem = {
        caption: caption,
        isCheckbox: true,
        isChecked: !!initialState
    };

    var callbackWrapper = function() {
        menuItem.isChecked = !menuItem.isChecked;
        this._presenter.updateCheckboxState(this._currentIndex, menuItem.isChecked);

        var args = Array.prototype.slice.apply(arguments);
        callback.apply(menuItem, args.concat([menuItem.isChecked]));
    }.bind(this);

    menuItem.callback = callbackWrapper;
    this._menuItems.push(menuItem);
};

Menu.prototype._renderHtml = function() {
    this._presenter.setMenuItems(this._menuItems);
    this._presenter.highlightMenuItem(this._currentIndex, this._menuItems);
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
    else if (ks.isEscapePressed() && this.escapeHandler) {
        this.escapeHandler(driver);
        needsUpdate = false;
    }
    else {
        needsUpdate = false;
    }

    if (needsUpdate) {
        this._presenter.highlightMenuItem(this._currentIndex, this._menuItems);
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

function MenuPresenter(containerElement, templateName) {
    this._container = containerElement;
    this._templateName = templateName;

    this._loadTemplate();
}

MenuPresenter.prototype._loadTemplate = function() {
    var templateHtml = document.getElementById(this._templateName).innerHTML;
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
        var li = this._createMenuItem(menuItems[i]);
        optionsList.appendChild(li);
    }
};

MenuPresenter.prototype._createMenuItem = function(menuItem) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(menuItem.caption));

    if (menuItem.cssClass) {
        li.className = menuItem.cssClass;
    }

    if (menuItem.isCheckbox) {
        var optionValue = document.createElement('span');
        optionValue.className = 'option-value';
        li.appendChild(optionValue);

        this._setCheckboxState(optionValue, menuItem.isChecked);
    }
    
    return li;
};

MenuPresenter.prototype.updateCheckboxState = function(index, isChecked) {
    var menuItem = this._container.getElementsByTagName('li');
    var optionValue = menuItem[index].getElementsByClassName('option-value')[0];

    this._setCheckboxState(optionValue, isChecked);
};

MenuPresenter.prototype._setCheckboxState = function(optionValue, isChecked) {
    optionValue.textContent = (isChecked ? 'Yes' : 'No');
    optionValue.style.color = (isChecked ? 'limegreen' : 'red');
};

MenuPresenter.prototype.highlightMenuItem = function(index, menuItems) {
    var menuItemElements = this._container.getElementsByTagName('li');

    for (var i = 0; i < menuItems.length; i += 1) {
        var otherClasses = menuItems[i].cssClass || '';

        switch(i) {
        case (index+1):
        case (index-1):
            menuItemElements[i].className = otherClasses + ' surround-active';
            break;

        case (index):
            menuItemElements[i].className = otherClasses + ' active';
            break;

        default:
            menuItemElements[i].className = otherClasses;
            break;
        }
    }
};

exports.Menu = Menu;
