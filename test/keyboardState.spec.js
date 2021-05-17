/*jshint expr:true*/ // allow 'should.be.true'
'use strict';

var chai = require('chai');
chai.should();

var KeyboardState = require('./../src/keyboardState.js').KeyboardState;

describe('KeyboardState', function() {
    var keyboardState;

    beforeEach(function() {
        keyboardState = new KeyboardState();
    });

    it('demo', () => {
        (1).should.equal(1);
    });

});

 
