'use strict';

var MenuBasePresenter = require('modules/menuBasePresenter.js').MenuBasePresenter;

function MenuBase(containerElement, templateName) {
    this._presenter = new MenuBasePresenter(containerElement, templateName);
    this._menuItems = [];

    this._createMenu();
    this._currentIndex = 0;

    this._renderHtml();
}

MenuBase.prototype.addButton = function(caption, callback, optionsOpt) {
    var cssClass = (optionsOpt && optionsOpt.cssClass) || null;

    this._menuItems.push({
        caption: caption,
        callback: callback,
        isCheckbox: false,
        cssClass: cssClass 
    });
};

MenuBase.prototype.addCheckbox = function(caption, initialState, callback) {
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

MenuBase.prototype._renderHtml = function() {
    this._presenter.setMenuItems(this._menuItems);
    this._presenter.highlightMenuItem(this._currentIndex, this._menuItems);
};

MenuBase.prototype.run = function(driver) {
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

MenuBase.prototype._setCurrentIndex = function(newCurrentIndex) {
    if (newCurrentIndex < 0 || newCurrentIndex >= this._menuItems.length) {
        return;
    }
    else {
        this._currentIndex = newCurrentIndex;
    }
};

MenuBase.prototype._runCurrentOption = function(driver) {
    this._menuItems[this._currentIndex].callback(driver);
};
MenuBase.extend = function(SubclassConstructor) {
    SubclassConstructor.prototype = Object.create(MenuBase.prototype);
    SubclassConstructor.prototype.constructor = SubclassConstructor;

    return SubclassConstructor;
};

exports.MenuBase = MenuBase;

