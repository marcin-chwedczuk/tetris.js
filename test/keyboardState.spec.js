/*jshint expr:true*/ // allow 'should.be.true'
'use strict';

var chai = require('chai');
chai.should();

var KeyboardState = require('../src/keyboardState.js').KeyboardState;

describe('KeyboardState', function() {
    var keyboardState;

    beforeEach(function() {
        keyboardState = new KeyboardState();
    });

    it('allows to read which keys are pressed', function() {
        keyboardState.setEnterPressed(true);

        keyboardState.isEnterPressed()
            .should.be.true;
    });

    it('allows to set key state (pressed/unpressed)', function() {
        keyboardState.setEnterPressed(false);

        keyboardState.isEnterPressed()
            .should.be.false;

        keyboardState.setEnterPressed(true);

        keyboardState.isEnterPressed()
            .should.be.true;
    });

    it('allows to set all keys to unpressed state', function() {
        keyboardState.setEnterPressed(true);
        keyboardState.setUpArrowPressed(true);

        keyboardState.clear();

        keyboardState.isEnterPressed()
            .should.be.false;

        keyboardState.isUpArrowPressed()
            .should.be.false;
    });
});

 
