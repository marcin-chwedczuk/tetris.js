'use strict';

function PresenterBase(containerElement, templateName) {
    this._container = containerElement;
    this._loadTemplate(templateName);
}

PresenterBase.prototype._loadTemplate = function(templateName) {
    var templateHtml = document.getElementById(templateName).innerHTML;
    this._container.innerHTML = templateHtml;
};

PresenterBase.extend = function(SubclassConstructor) {
    SubclassConstructor.prototype = Object.create(PresenterBase.prototype);
    SubclassConstructor.prototype.constructor = SubclassConstructor;

    return SubclassConstructor;
};

PresenterBase.prototype._setElementText = function(elementId, text) {
    var element = document.getElementById(elementId);
    if (!element) {
        throw new Error('cannot find element with id: ' + elementId);
    }

    // clear element
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    // set text
    element.appendChild(document.createTextNode(text));
};

exports.PresenterBase = PresenterBase;
