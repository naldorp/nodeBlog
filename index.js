var express = require("express"),
    http = require("http"),
    path = require("path"),
    routes = require("./routes"),
    mongoskin = require("mongoskin"),
    dbConnectionString = process.env.DATABASE_CON || "mongodb://@localhost:27017/blog",
    db = mongoskin.db(dbConnectionString, {safe:true}),
    collections = { articles: db.collection('articles'), users: db.collection('users')};
  
//express requires  
var session = require('express-session'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
    
var app = express();

//middleware(expose all collections to all routes)
app.use(function(req,res,next){
    if(!collections.articles || !collections.users) return next(new Error('No collections'));
    req.collections = collections;
    return next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname,'public')));
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if('development' == app.get('env')){
    app.use(errorHandler());
}

//routes
app.get('/', routes.index);
app.get('/login',routes.user.login)
app.post('/login',routes.user.auth)
app.get('/logout',routes.user.logout)
app.get('/admin',routes.article.admin)
app.get('/admin/post',routes.article.post)
app.post('/admin/post',routes.article.postArticle)

//api routes
app.get('/api/articles',routes.article.list)
app.post('/api/articles',routes.article.add)
app.put('/api/articles/:id',routes.article.edit)
app.delete('/api/articles/:id',routes.article.del)

app.all('*',function(req,res){
   res.send(404) ;
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