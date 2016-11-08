var express = require("express");

var http = require("http");
var path = require("path");

var app = express();

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));

app.all('*', function(req, res) {
    res.render('index', {
        msg: 'Hello World from template'
    });
});

var server = http.createServer(app);

var boot = function() {
    server.listen(app.get('port'), function() {
        if(process.env.NODE_ENV != 'test')
            console.log('Listening on port ' + app.get('port'));
    });
}

var shutdown = function(){
    server.close();
}

if(require.main == module){
    boot();
}
else{
    console.info("Running index as module");
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}