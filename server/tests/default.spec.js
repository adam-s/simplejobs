'use strict';

describe('Test tests', function (){
    describe('Pending test', function() {
        it('should be pending');
    });

    describe('Failing test', function() {
        it('should fail', function() {
            expect(3*3).to.be.equal(8);
        });
    });

    describe('Passing test', function() {
        it('should pass', function() {
            expect([4, 5, "Arrrr!!"]).to.deep.equal([4, 5, "Arrrr!!"]);
        });
    });

    describe('Sinon tests', function() {
       var Test = {
           do: function(thing){ return thing + ' and something'}
       };

        describe('Stubby', function() {
           it('should stub a method', function() {
               expect(Test.do('thing')).to.equal('thing and something');

               sinon.stub(Test, "do", function(thing){ return thing});
               expect(Test.do('thing')).to.equal('thing');

               Test.do.restore();
               expect(Test.do('thing')).to.equal('thing and something');
           });

        });
    });
});