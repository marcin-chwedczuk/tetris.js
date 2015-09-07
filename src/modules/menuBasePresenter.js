'use strict';

var PresenterBase = require('modules/presenterBase.js').PresenterBase;

var MenuBasePresenter = PresenterBase.extend(function(containerElement, templateName) {
    PresenterBase.call(this, containerElement, templateName);
});

MenuBasePresenter.prototype.setMenuItems = function(menuItems) {
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

MenuBasePresenter.prototype._createMenuItem = function(menuItem) {
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

MenuBasePresenter.prototype.updateCheckboxState = function(index, isChecked) {
    var menuItem = this._container.getElementsByTagName('li');
    var optionValue = menuItem[index].getElementsByClassName('option-value')[0];

    this._setCheckboxState(optionValue, isChecked);
};

MenuBasePresenter.prototype._setCheckboxState = function(optionValue, isChecked) {
    optionValue.textContent = (isChecked ? 'Yes' : 'No');
    optionValue.style.color = (isChecked ? 'limegreen' : 'red');
};

MenuBasePresenter.prototype.highlightMenuItem = function(index, menuItems) {
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

exports.MenuBasePresenter = MenuBasePresenter;
