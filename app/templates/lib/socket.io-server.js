module.exports = function(server){
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {
    socket.on('foo', function(data){
      socket.emit('bar', data);
      socket.broadcast.emit('foobar', data);
    });
  });
};
