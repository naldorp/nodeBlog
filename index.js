var TWITTER_C_Key = 'IGdsTMbFn4qmMUBKY2XsZXkkC';
var TWITTER_S_Key = 'yiyHUu3yieOLt3fF9ok6hU7BuiCD4wgrYzP1KulAOeZoYsMxBe';

var express = require("express"),
    http = require("http"),
    path = require("path"),
    routes = require("./routes"),
    mongoose = require("mongoose"),
    models = require('./models'),
    dbConnectionString = process.env.DATABASE_CON || "mongodb://localhost:27017/blog",
    db = mongoose.connect(dbConnectionString, {safe:true});

//express requires  
var session = require('express-session'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");

var everyauth = require("everyauth");
//everyauth.debug = true;
everyauth.twitter.consumerKey(TWITTER_C_Key).consumerSecret(TWITTER_S_Key).findOrCreateUser(function(session, accessToken, accessTokenSecret, twitterUserMetada) {
   if (twitterUserMetada.screen_name === "naldoRP") {
        session.user = twitterUserMetada;
        session.admin = true;
   }
   return twitterUserMetada;
}).redirectPath('/admin');

everyauth.everymodule.handleLogout(routes.user.logout);
everyauth.everymodule.findUserById(function(user, callback) {
    callback(user);
})

var app = express();

//middleware(expose all collections to all routes)
app.use(function(req, res, next) {
    if (!models.Article || !models.User) return next(new Error('No models loaded'));
    req.models = models;
    return next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());
app.use(session({
    secret: 'And I say, yay',
    resave: true,
    saveUninitialized: false
}));
app.use(cookieParser('heuheueh'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(everyauth.middleware());

//authentication middleware
app.use(function(req, res, next) {
    if (req.session && req.session.admin) {
        res.locals.admin = true;
    }
    next();
});

//authorization middleware
var authorize = function(req, res, next) {
    if (req.session && req.session.admin)
        return next()
    else
        return res.sendStatus(401);
}

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

//routes
app.get('/', routes.index);
app.get('/login', routes.user.login)
app.post('/login', routes.user.auth)
app.get('/logout', routes.user.logout)
app.get('/admin', authorize, routes.article.admin)
app.get('/admin/post', authorize, routes.article.post)
app.post('/admin/post', authorize, routes.article.postArticle)

//api routes
app.all('/api', authorize);
app.get('/api/articles', routes.article.list)
app.post('/api/articles', routes.article.add)
app.put('/api/articles/:id', routes.article.edit)
app.delete('/api/articles/:id', routes.article.del)

app.all('*', function(req, res) {
    res.sendStatus(404);
});

var server = http.createServer(app);

var boot = function() {
    server.listen(app.get('port'), function() {
        if (process.env.NODE_ENV != 'test')
            console.log('Listening on port ' + app.get('port'));
    });
}

var shutdown = function() {
    server.close();
}

if (require.main == module) {
    boot();
}
else {
    console.info("Running index as module");
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}