const keys = require("./keys");
const redis = require("redis");

//this file watches redis for new indices, pulls each new indice , calculate new value then puts it back into redis

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

const calFib = (index) => {
  if (index < 2) return 1;
  return calFib(index - 1) + calFib(index - 2);
};

//anytime we get a message which is index here calculate the fibannaci and set it in the redis
sub.on("message", (channel, message) => {
  redisClient.hset("values", message, calFib(parseInt(message)));
});

//look for any insert in redis
sub.subscribe("insert");
