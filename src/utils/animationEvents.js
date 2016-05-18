'use strict';

// from: https://davidwalsh.name/css-animation-callback
function getSupportedAnimationEndEvent(){
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    };

    for(var t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }

    return null;
}

var ANIMATION_END_EVENT = getSupportedAnimationEndEvent();
console.log('SUPPORTED ANIMATION END EVENT: ' + ANIMATION_END_EVENT);

function whenAnimationEnd(element, callback) {
    if (!ANIMATION_END_EVENT) {
        setTimeout(callback, 0);
    }
    else {
        var listener = function() {
            callback();
            element.removeEventListener(ANIMATION_END_EVENT, listener);
        };

        element.addEventListener(ANIMATION_END_EVENT, listener);
    }
}

function whenAnimationEndForAll(elements, callback) {
    var missing = elements.length;

    var elementCallback = function() {
        console.log('ANIMATION END FOR SINGLE ELEMENT');
        missing--;
        if (missing === 0) {
            console.log('ANIMATION END FOR ALL');
            callback();
        }
    };

    for (var i = 0; i < elements.length; i += 1) {
        whenAnimationEnd(elements[i], elementCallback);
    }
}

exports.whenAnimationEnd = whenAnimationEnd;
exports.whenAnimationEndForAll = whenAnimationEndForAll;

