
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

var config = require('./config');

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
  console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(server);

io
  .of('/chat')
  .on('connection', function(socket) {
    socket.emit('successful connection');
    if (io.rooms.hasOwnProperty('/chat/' + config.admin.name)) {
      socket.emit('admin is joined');
    }
    socket.on('message', function(data) {
      socket.get('name', function(err, name) {
        if (err) { console.log(err); }
        data.from = name;
        if (name === config.admin.name
            && typeof data.to === 'undefined') {
          return false;
        }
        io
          .of('/chat')
          .in(data.to || config.admin.name)
          .emit('message', data);
        socket.emit('message', data);
      });
    });
    socket.on('register', function(name) {
      // reject duplicated names
      if (io.rooms.hasOwnProperty('/chat/' + name)) {
        socket.emit('rejected',
          { message: 'The name ' + name + 
                      ' is already in use.' +
                      ' pick a different one.'})
      } else {
        // check if name comes with :password appended
        var auth = name.match(/^([^:]*):(.*)$/);
        if (auth) {
          // set authorization
          var authorized = false;
          name = auth[1];
          var pass = auth[2];
          if (name === config.admin.name
              && pass === config.admin.password) {
            authorized = true;
          }
        }
        // check restricted name
        if (name === config.admin.name && !authorized) {
          socket.emit('restricted name', {
            message: name + ' is a restricted name'
          });
        } else {
          // register name in store
          socket.set('name', name, function(){
            var data = { 
              message: 'You are now connected',
              name: name };
            if (name === config.admin.name) {
              data.isAdmin = true;
              socket.join(name);
              socket
                .broadcast
                .emit('admin just joined');
            } else {
              if (io.rooms.hasOwnProperty('/chat/' + config.admin.name)) {
                data.adminIsConnected = true;
                socket.join(name);
              } else {
                data.message = 'I\'m not available right now, please try again later';
              }
            }
            socket.emit('registered', data);
                
          });
        }
      }
    });
    socket.on('unregister', function() {
      socket.get('name', function(err, name) {
        if (err) { throw err; }
        socket.leave(name);
        socket.emit('unregistered', {
          message: 'You are now disconnected',
          name: name });
        if (name == config.admin.name) {
          socket
            .broadcast
            .emit('admin leaved');
        }
        socket
          .del('name');
      });
    });
  });