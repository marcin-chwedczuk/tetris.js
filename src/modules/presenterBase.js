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

exports.PresenterBase = PresenterBase;
