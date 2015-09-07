/*jshint expr:true*/ // allow 'should.be.true'
'use strict';

var chai = require('chai');
chai.should();

var utils = require('./../src/utils/utils.js');

describe('utils', function() {
    describe('extend', function() {
        it('allows to copy properties of one object to another', function() {
            var objectToExtend = {
                foo: 1
            };

            var additionalProperties = {
                bar: 'bar',
                nyu: 3
            };

            utils.extend(objectToExtend, additionalProperties);

            objectToExtend.foo
                .should.equal(1);

            objectToExtend.bar
                .should.equal('bar');

            objectToExtend.nyu
                .should.equal(3);
        });
    });
});
