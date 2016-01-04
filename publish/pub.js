var redis = require("redis");
 
var REDIS_URL = 'localhost';
var REDIS_PORT = 6379;

// create a redis connection
try
{
	var redisClient = redis.createClient( REDIS_PORT, REDIS_URL );
	process.argv.forEach(function (val, index, array) {
		redisClient.publish( "booking_engine", val );
	});
	
	redisClient.quit();
}
catch (err)
{
 	console.log( "ERROR => Cannot connect to Redis message broker: URL => " + REDIS_URL + "; Port => " + REDIS_PORT );
 	console.log(err);
}