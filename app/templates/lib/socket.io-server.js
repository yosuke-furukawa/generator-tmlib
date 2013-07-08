module.exports = function(server){
  <% if (use_heroku) { %>
  var transports = ["xhr-polling"];
  var io = require('socket.io').listen(server, { transports: transports});
  <% } else {%>
  var io = require('socket.io').listen(server);
  <% } %>

  io.sockets.on('connection', function(socket) {
    socket.on('comment', function(data) {
      // send to me
      socket.emit('comment', data);
      // broadcast without me
      socket.broadcast.emit('comment', data);
    });
  });
};
