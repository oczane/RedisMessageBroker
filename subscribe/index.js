//include redis npm
var redis = require("redis")
 
// define url, port and credentials of redis to connect
var REDIS_URL = 'localhost';
var REDIS_PORT = 6379;


//connect to redis
var redisClient = redis.createClient( REDIS_PORT, REDIS_URL );

redisClient.on("message", function (channel, message) {
 	// message received - output to console window
 	console.log("client channel => " + channel + "; message => " + message + ";");
 
});

// subscribe to receive messages from a particular channel
redisClient.subscribe("booking_engine");