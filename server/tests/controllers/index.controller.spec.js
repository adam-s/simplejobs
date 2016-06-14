'use strict';

describe('Index controller', function() {
    it('Should load the text at /', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .expect(function(response) {
                console.log(response.text);
                expect(response.text).to.contain('ng-app="live"');
            })
            .end(done);
    })
})