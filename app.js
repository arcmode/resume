
/**
 * Module dependencies.
 */

var os = require('os');

var express = require('express')
  , socketio = require('socket.io')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , expressUglify = require('express-uglify');

var app = express();

var chat = require('./chat');

app.configure('production', function() {
  app.use(expressUglify.middleware({
    src: __dirname + '/public'
    , logLevel: 'error'
  }));
});

app.configure('development', function() {
  app.use(function(req, res, next){
    if (!process.env.NOCOMPRESS) {
      app.use(expressUglify.middleware({
        src: __dirname + '/public'
        , logLevel: 'info'
      }));
    }
    next();
  })
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(function(req, res, next){
    app.locals.title = 'drojas';
    next();
  });
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/contact', routes.contact);
app.get('/about', routes.about);

var server = http.createServer(app).listen(app.get('port'), function() {
  chat(io);
  console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(server);


