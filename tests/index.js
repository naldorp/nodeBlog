var boot = require("../index").boot;
var shutdown = require("../index").shutdown;
var port = require("../index").port;
var expect = require("expect.js");
var superagent = require("superagent");

describe('server', function() {
    before(function() {
        boot();
    });

    describe('#index.get(/)', function() {
        it('should respond to GET', function(done) {
            superagent
            .get('http://localhost:' + port)
            .end(function(err, res) {
                    if(err) console.error(err);
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });
    
    after(function(){
        shutdown();
    });

});