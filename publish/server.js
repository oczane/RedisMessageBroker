var WebSocketServer = require('websocket').server;
var http = require('http');

var redis = require("redis");
 
var REDIS_URL = 'localhost';
var REDIS_PORT = 6379;

// create a redis connection
try
{
	var redisClient = redis.createClient( REDIS_PORT, REDIS_URL );
}
catch (err)
{
 	console.log( "ERROR => Cannot connect to Redis message broker: URL => " + REDIS_URL + "; Port => " + REDIS_PORT );
 	console.log(err);
}
 
var server = http.createServer(function(request, response) {
 	console.log((new Date()) + ' Received request for ' + request.url);
 	response.writeHead(404);
 	response.end();
});

server.listen(8080, function() {
	console.log((new Date()) + ' Server is listening on port 8080');
});
 
wsServer = new WebSocketServer({
 httpServer: server,
 // You should not use autoAcceptConnections for production
 // applications, as it defeats all standard cross-origin protection
 // facilities built into the protocol and the browser. You should
 // *always* verify the connection's origin and decide whether or not
 // to accept it.
 autoAcceptConnections: false
});

function originIsAllowed(origin) {
 // put logic here to detect whether the specified origin is allowed.
 	console.log(origin);
 	return true;
}
 
wsServer.on('request', function(request) {
 	if (!originIsAllowed(request.origin)) {
	 	// Make sure we only accept requests from an allowed origin
	 	request.reject();
	 	console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
	 	return;
 }
 
var connection = request.accept('kraken-protocol', request.origin);
 	console.log((new Date()) + ' Connection accepted.');
 
	connection.on('message', function(message) {
 
	 if (message.type === 'utf8') {
	 console.log('Received Message: ' + message.utf8Data);
 
	// post the message to the redis message broker
	 var channelName = 'application_channel';
	 redisClient.publish(channelName, message.utf8Data);
 }
 });

 connection.on('close', function(reasonCode, description) {
 	console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
 });
 
});