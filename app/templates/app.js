
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var cons = require('consolidate');
var io_server = require('./lib/socket.io-server.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
<% if (template_engine.consolidate) { %>
app.engine('<%= template_engine.extension %>', cons.<%= template_engine.consolidate %>);
<% } %>
app.set('view engine', '<%= template_engine.extension %>');
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(require('connect-livereload')());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io_server(server);
