
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , email = require('./email')
  , user = require('./routes/user')
  , rss = require('./routes/rss')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/users', user.list);
app.get('/users2', user.list2);
app.post('/users', user.create);

app.get('/check', rss.check);
app.get('/test', rss.test);
app.get('/test/email', email.sendMail);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Periodic subscription check
//setInterval(rss.periodicCheck, 1000 * 10);