
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , expressUglify = require('express-uglify');

var app = express();

app.configure('production', function(){
  app.use(expressUglify.middleware({
    src: __dirname + '/public'
    , logLevel: 'error'
  }));
});

app.configure('development', function(){
  app.use(expressUglify.middleware({
    src: __dirname + '/public'
    , logLevel: 'info'
  }));
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
    app.locals({
      title: 'David Rojas Camaggi'
    })
    next();
  });
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/contact', routes.contact);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
