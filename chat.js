var config;

try {
  config = require('./config');
}
catch (e) {
  config = {
    "admin": {
      "name": "Admin",
      "password": "password"
    }
  }
}

module.exports = function(io){
  var chatServer = io.of('/chat');
  chatServer
    .on('connection', function(socket){
      socket.emit('successful connection');
      informAdminPresence(chatServer, socket, io);
      message(chatServer, socket);
      register(chatServer, socket, io);
      unregister(chatServer, socket, io);
    });
};

function informAdminPresence(server, socket, io) {
  if (io.rooms.hasOwnProperty('/chat/' + config.admin.name)) {
      socket.emit('admin is joined');
    }
}

function message(server, socket) {
  socket.on('message', function(data) {
    socket.get('name', function(err, name) {
      if (err) { console.log(err); }
      data.from = name;
      if (name === config.admin.name
          && typeof data.to === 'undefined') {
        return false;
      }
      server
        .in(data.to || config.admin.name)
        .emit('message', data);
      socket.emit('message', data);
    });
  });
}

function register(server, socket, io) {
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
};

function unregister(server, socket) {
  socket.on('unregister', function() {
    socket.get('name', function(err, name) {
      if (err) { throw err; }
      socket.leave(name);
      socket.emit('unregistered', {
        message: 'You are now disconnected',
        name: name });
      if (name == config.admin.name) {
        server
          .emit('admin leaved');
      }
      socket
        .del('name');
    });
  });
};