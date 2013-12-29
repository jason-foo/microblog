
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var partials = require('express-partials');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.routes);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    db: settings.db
  })
}));
var flash = require('connect-flash');
app.use(flash());
app.use(partials());
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  var err = req.flash('error');
  res.locals.error = err.length ? err : null;
  var succ = req.flash('success');
  res.locals.success = succ.length ? succ : null;
  next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);
app.get('/error', routes.error);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*
app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  },
  error: function(req, res) {
    var err = req.flash('error');
    if (err.length)
      return err;
    else
      return null;
  },
  success: function(req, res) {
    var succ = req.flash('success');
    if (succ.length)
      return succ;
    else
      return null;
  },
});
*/